import type { ScheduledEvent, Context } from 'aws-lambda';
import { fetchAnnouncementList, fetchAnnouncementDetail } from './crawler.js';
import { downloadAndUpload } from './downloader.js';
import type { CrawlResult, UploadResult } from './types.js';

/**
 * Lambda 핸들러 - EventBridge Scheduler에 의해 12시간 주기로 실행됩니다.
 *
 * 실행 흐름:
 * 1. SH 공고 목록 크롤링
 * 2. 각 공고의 상세 페이지에서 PDF 첨부파일 추출
 * 3. PDF 다운로드 → S3 업로드 (중복은 HeadObject로 스킵)
 *
 * S3 경로: home-fit-documents/announcements/{nttId}/{filename}.pdf
 */
export async function handler(
  _event: ScheduledEvent,
  context: Context
): Promise<CrawlResult> {
  console.log('[handler] SH Crawler Lambda started');
  const startTime = Date.now();
  const deadlineMs = getDeadlineMs(startTime, context);
  const shouldContinue = () => hasEnoughTime(deadlineMs);

  // 1. 공고 목록 크롤링
  const announcements = await fetchAnnouncementList({ deadlineMs });
  console.log(`[handler] Total announcements from list: ${announcements.length}`);

  if (announcements.length === 0) {
    console.log('[handler] No announcements found. Exiting.');
    return {
      totalAnnouncements: 0,
      newAnnouncements: 0,
      uploadedPdfs: 0,
      failedPdfs: 0,
      details: [],
      executedAt: new Date().toISOString(),
    };
  }

  // 2 & 3. 각 공고의 상세 페이지 크롤링 + PDF 다운로드/업로드
  // 중복 감지는 downloader 내부에서 HeadObject로 처리
  const allResults: UploadResult[] = [];
  let newCount = 0;

  for (const entry of announcements) {
    if (!shouldContinue()) {
      console.warn(
        `[handler] Stop before nttId=${entry.nttId}: not enough Lambda time remains`
      );
      break;
    }

    try {
      const detail = await fetchAnnouncementDetail(entry.nttId);

      if (detail.attachments.length === 0) {
        console.log(`[handler] nttId=${entry.nttId}: no PDF attachments, skipping`);
        continue;
      }

      const results = await downloadAndUpload(detail, { shouldContinue });
      if (results.length > 0) {
        newCount++;
      }
      allResults.push(...results);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[handler] Failed to process nttId=${entry.nttId}: ${errorMessage}`);

      allResults.push({
        nttId: entry.nttId,
        fileName: '',
        s3Key: '',
        success: false,
        error: errorMessage,
      });
    }
  }

  const uploadedPdfs = allResults.filter((r) => r.success).length;
  const failedPdfs = allResults.filter((r) => !r.success).length;
  const elapsed = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log(
    `[handler] Completed in ${elapsed}s: ` +
      `${announcements.length} announcements checked, ` +
      `${uploadedPdfs} PDFs uploaded, ${failedPdfs} failed`
  );

  return {
    totalAnnouncements: announcements.length,
    newAnnouncements: newCount,
    uploadedPdfs,
    failedPdfs,
    details: allResults,
    executedAt: new Date().toISOString(),
  };
}

function getDeadlineMs(startTime: number, context: Context): number {
  const lambdaRemainingMs =
    typeof context.getRemainingTimeInMillis === 'function'
      ? context.getRemainingTimeInMillis()
      : 15 * 60 * 1000;
  const hardLimitMs = 15 * 60 * 1000;
  const safetyBufferMs = Number(process.env.LAMBDA_SAFETY_BUFFER_MS ?? 30_000);

  return startTime + Math.min(lambdaRemainingMs, hardLimitMs) - safetyBufferMs;
}

function hasEnoughTime(deadlineMs: number): boolean {
  const minRemainingMs = Number(process.env.LAMBDA_MIN_REMAINING_MS ?? 60_000);
  return deadlineMs - Date.now() > minRemainingMs;
}
