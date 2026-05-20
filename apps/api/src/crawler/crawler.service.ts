import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement, AnnouncementStatus } from './schemas/announcement.schema';
import { CrawlRun } from './schemas/crawl-run.schema';
import { RawAnnouncement, ScraperService } from './scraper.service';
import { PdfStorageService } from './pdf-storage.service';

export interface CrawlResult {
  status: 'success' | 'failed';
  new_count: number;
  updated_count: number;
  total_scraped: number;
  error_message: string | null;
  duration_ms: number;
}

@Injectable()
export class CrawlerService {
  private readonly logger = new Logger(CrawlerService.name);
  private isRunning = false;

  constructor(
    @InjectModel(Announcement.name) private readonly announcementModel: Model<Announcement>,
    @InjectModel(CrawlRun.name) private readonly crawlRunModel: Model<CrawlRun>,
    private readonly scraperService: ScraperService,
    private readonly pdfStorageService: PdfStorageService
  ) {}

  async crawl(source: 'schedule' | 'manual'): Promise<CrawlResult> {
    if (this.isRunning) {
      this.logger.warn('Crawl already in progress, skipping');
      return {
        status: 'failed',
        new_count: 0,
        updated_count: 0,
        total_scraped: 0,
        error_message: 'Crawl already in progress',
        duration_ms: 0
      };
    }

    this.isRunning = true;
    const startedAt = new Date();
    let newCount = 0;
    let updatedCount = 0;
    let totalScraped = 0;
    let errorMessage: string | null = null;

    try {
      this.logger.log(`Starting crawl (source: ${source})`);

      // 1. 게시판 목록 페이지 스크래핑
      const rawAnnouncements = await this.scraperService.fetchListPage();
      totalScraped = rawAnnouncements.length;

      // 2. 기존 활성 공고 seq 목록 조회 (마감 상태 업데이트용)
      const activeSeqs = await this.getActiveSeqs();

      // 3. 각 공고 처리
      for (const raw of rawAnnouncements) {
        try {
          const result = await this.processAnnouncement(raw);
          if (result === 'new') newCount++;
          if (result === 'updated') updatedCount++;
        } catch (err) {
          this.logger.error(`Failed to process announcement seq=${raw.seq}: ${(err as Error).message}`);
        }
      }

      // 4. 게시판에서 사라진 활성 공고 → 마감 처리
      const currentSeqs = new Set(rawAnnouncements.map((a) => a.seq));
      for (const activeSeq of activeSeqs) {
        if (!currentSeqs.has(activeSeq)) {
          await this.announcementModel.updateOne(
            { seq: activeSeq, status: { $ne: '마감' } },
            { status: '마감', updated_at: new Date() }
          );
          updatedCount++;
        }
      }

      this.logger.log(
        `Crawl complete: ${newCount} new, ${updatedCount} updated, ${totalScraped} total scraped`
      );
    } catch (err) {
      errorMessage = (err as Error).message;
      this.logger.error(`Crawl failed: ${errorMessage}`);
    } finally {
      this.isRunning = false;
    }

    const completedAt = new Date();
    const durationMs = completedAt.getTime() - startedAt.getTime();

    // CrawlRun 이력 저장
    await this.crawlRunModel.create({
      source,
      status: errorMessage ? 'failed' : 'success',
      board: '분양',
      new_count: newCount,
      updated_count: updatedCount,
      total_scraped: totalScraped,
      error_message: errorMessage,
      started_at: startedAt,
      completed_at: completedAt
    });

    return {
      status: errorMessage ? 'failed' : 'success',
      new_count: newCount,
      updated_count: updatedCount,
      total_scraped: totalScraped,
      error_message: errorMessage,
      duration_ms: durationMs
    };
  }

  private async processAnnouncement(raw: RawAnnouncement): Promise<'new' | 'updated' | 'skipped'> {
    const existing = await this.announcementModel.findOne({ seq: raw.seq });

    if (existing) {
      // 기존 공고: 마감 상태 업데이트 확인
      const newStatus = this.determineStatus(raw);
      if (newStatus === '마감' && existing.status !== '마감') {
        await this.announcementModel.updateOne(
          { seq: raw.seq },
          { status: '마감', updated_at: new Date() }
        );
        return 'updated';
      }
      return 'skipped';
    }

    // 신규 공고: 공지 제외
    if (this.isNotice(raw)) {
      return 'skipped';
    }

    // 상세 페이지에서 PDF URL 추출
    let pdfUrls: string[] = [];
    try {
      pdfUrls = await this.scraperService.fetchDetailPage(raw.detail_url);
    } catch (err) {
      this.logger.warn(`Failed to fetch detail page for seq=${raw.seq}: ${(err as Error).message}`);
    }

    // PDF S3 업로드
    const s3PdfKeys: string[] = [];
    for (const pdfUrl of pdfUrls) {
      try {
        const s3Key = await this.pdfStorageService.uploadPdf(pdfUrl, raw.seq);
        s3PdfKeys.push(s3Key);
      } catch (err) {
        this.logger.warn(`Failed to upload PDF for seq=${raw.seq}: ${(err as Error).message}`);
      }
    }

    // DB 저장
    const now = new Date();
    await this.announcementModel.create({
      seq: raw.seq,
      title: raw.title,
      housing_type: this.extractHousingType(raw.title),
      supply_category: '분양',
      status: this.determineStatus(raw),
      application_start: this.parseDate(raw.date),
      application_end: null,
      detail_url: raw.detail_url,
      pdf_urls: pdfUrls,
      s3_pdf_keys: s3PdfKeys,
      analysis_status: s3PdfKeys.length > 0 ? 'pending' : 'failed',
      crawled_at: now,
      updated_at: now
    });

    return 'new';
  }

  private determineStatus(raw: RawAnnouncement): AnnouncementStatus {
    const statusLower = raw.status.toLowerCase();
    if (statusLower.includes('마감') || statusLower.includes('종료')) return '마감';
    if (statusLower.includes('예정')) return '예정';
    return '진행중';
  }

  private isNotice(raw: RawAnnouncement): boolean {
    return raw.status === '공지' || raw.seq === '공지';
  }

  private extractHousingType(title: string): string {
    const types = ['공공분양', '신혼희망타운', '나눔형', '선택형', '일반분양'];
    for (const type of types) {
      if (title.includes(type)) return type;
    }
    return '공공분양';
  }

  private parseDate(dateStr: string | null): string | null {
    if (!dateStr) return null;
    const match = dateStr.match(/(\d{4})[-./](\d{2})[-./](\d{2})/);
    if (!match) return null;
    return `${match[1]}-${match[2]}-${match[3]}`;
  }

  private async getActiveSeqs(): Promise<string[]> {
    const docs = await this.announcementModel
      .find({ status: { $ne: '마감' } })
      .select('seq')
      .lean();
    return docs.map((d) => d.seq);
  }
}
