import {
    S3Client,
    PutObjectCommand,
    HeadObjectCommand,
} from '@aws-sdk/client-s3';
import type { AnnouncementDetail, UploadResult } from './types.js';

const USER_AGENT =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36';

const FETCH_DELAY_MS = Number(process.env.SH_DOWNLOAD_DELAY_MS ?? 300);
const DOWNLOAD_TIMEOUT_MS = Number(process.env.SH_DOWNLOAD_TIMEOUT_MS ?? 60_000);

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

const s3 = new S3Client({});

/** S3 버킷 이름 (고정) */
const BUCKET_NAME = process.env.S3_BUCKET_NAME ?? 'home-fit-documents';

/** S3 key prefix (announcements/) */
const S3_PREFIX = 'announcements';

/**
 * 특정 공고의 PDF가 S3에 이미 존재하는지 확인합니다.
 * PUT 권한만 부여된 환경에서도 HeadObject로 존재 여부를 확인할 수 있습니다.
 * HeadObject 권한도 없으면 중복 감지를 스킵하고 항상 업로드합니다.
 */
export async function existsInS3(nttId: string, fileName: string): Promise<boolean> {
  const key = `${S3_PREFIX}/${nttId}/${fileName}`;
  try {
    await s3.send(new HeadObjectCommand({ Bucket: BUCKET_NAME, Key: key }));
    return true;
  } catch (error: unknown) {
    const err = error as { name?: string; $metadata?: { httpStatusCode?: number } };
    if (err.name === 'NotFound' || err.$metadata?.httpStatusCode === 404) {
      return false;
    }
    // HeadObject 권한이 없으면 중복 감지 스킵 (항상 업로드)
    console.warn(`[downloader] HeadObject failed for ${key}, assuming not exists`);
    return false;
  }
}

/**
 * 공고의 PDF 첨부파일을 다운로드하여 S3에 업로드합니다.
 * S3 경로: home-fit-documents/announcements/{nttId}/{filename}.pdf
 */
export async function downloadAndUpload(
  announcement: AnnouncementDetail,
  options: { shouldContinue?: () => boolean } = {}
): Promise<UploadResult[]> {
  const results: UploadResult[] = [];

  for (const attachment of announcement.attachments) {
    if (options.shouldContinue && !options.shouldContinue()) {
      console.warn(`[downloader] Stop before ${announcement.nttId}/${attachment.fileName}: not enough Lambda time remains`);
      break;
    }

    const s3Key = `${S3_PREFIX}/${announcement.nttId}/${attachment.fileName}`;

    try {
      // 중복 확인
      const alreadyExists = await existsInS3(announcement.nttId, attachment.fileName);
      if (alreadyExists) {
        console.log(`[downloader] Already exists, skipping: ${s3Key}`);
        continue;
      }

      console.log(`[downloader] Downloading: ${attachment.fileName}`);
      await delay(FETCH_DELAY_MS);

      const response = await fetch(attachment.downloadUrl, {
        headers: {
          'User-Agent': USER_AGENT,
          Accept: 'application/pdf,application/octet-stream,*/*',
          Referer: `https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_241/view.do?seq=${announcement.nttId}`,
        },
        redirect: 'follow',
        signal: AbortSignal.timeout(DOWNLOAD_TIMEOUT_MS),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status} downloading ${attachment.downloadUrl}`);
      }

      const buffer = Buffer.from(await response.arrayBuffer());

      // PDF 파일 유효성 간단 체크 (매직 바이트)
      if (buffer.length < 4 || buffer.toString('utf8', 0, 4) !== '%PDF') {
        console.warn(`[downloader] Warning: ${attachment.fileName} may not be a valid PDF (size: ${buffer.length})`);
      }

      console.log(`[downloader] Uploading to S3: s3://${BUCKET_NAME}/${s3Key} (${buffer.length} bytes)`);

      await s3.send(
        new PutObjectCommand({
          Bucket: BUCKET_NAME,
          Key: s3Key,
          Body: buffer,
          ContentType: 'application/pdf',
          Metadata: {
            'ntt-id': announcement.nttId,
            title: encodeURIComponent(announcement.title),
            'original-filename': encodeURIComponent(attachment.fileName),
            'crawled-at': new Date().toISOString(),
          },
        })
      );

      results.push({
        nttId: announcement.nttId,
        fileName: attachment.fileName,
        s3Key,
        success: true,
      });

      console.log(`[downloader] Successfully uploaded: s3://${BUCKET_NAME}/${s3Key}`);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`[downloader] Failed to process ${attachment.fileName}: ${errorMessage}`);

      results.push({
        nttId: announcement.nttId,
        fileName: attachment.fileName,
        s3Key,
        success: false,
        error: errorMessage,
      });
    }
  }

  return results;
}
