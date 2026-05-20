import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { CrawlerService } from './crawler.service';
import { ScraperService } from './scraper.service';
import { PdfStorageService } from './pdf-storage.service';
import { Announcement } from './schemas/announcement.schema';
import { CrawlRun } from './schemas/crawl-run.schema';

describe('CrawlerService', () => {
  let service: CrawlerService;
  let scraperService: jest.Mocked<ScraperService>;
  let pdfStorageService: jest.Mocked<PdfStorageService>;
  let announcementModel: Record<string, jest.Mock>;
  let crawlRunModel: Record<string, jest.Mock>;

  beforeEach(async () => {
    announcementModel = {
      findOne: jest.fn(),
      find: jest.fn().mockReturnValue({ select: jest.fn().mockReturnValue({ lean: jest.fn().mockResolvedValue([]) }) }),
      create: jest.fn().mockResolvedValue({}),
      updateOne: jest.fn().mockResolvedValue({})
    };

    crawlRunModel = {
      create: jest.fn().mockResolvedValue({})
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CrawlerService,
        {
          provide: ScraperService,
          useValue: {
            fetchListPage: jest.fn(),
            fetchDetailPage: jest.fn()
          }
        },
        {
          provide: PdfStorageService,
          useValue: {
            uploadPdf: jest.fn()
          }
        },
        {
          provide: getModelToken(Announcement.name),
          useValue: announcementModel
        },
        {
          provide: getModelToken(CrawlRun.name),
          useValue: crawlRunModel
        }
      ]
    }).compile();

    service = module.get<CrawlerService>(CrawlerService);
    scraperService = module.get(ScraperService) as jest.Mocked<ScraperService>;
    pdfStorageService = module.get(PdfStorageService) as jest.Mocked<PdfStorageService>;
  });

  describe('crawl', () => {
    it('should process new announcements and save to DB', async () => {
      scraperService.fetchListPage.mockResolvedValue([
        { seq: '100', title: '테스트 공공분양', status: '진행중', detail_url: 'https://example.com/100', date: '2025-01-15' }
      ]);
      scraperService.fetchDetailPage.mockResolvedValue(['https://example.com/doc.pdf']);
      pdfStorageService.uploadPdf.mockResolvedValue('announcements/100/doc.pdf');
      announcementModel.findOne.mockResolvedValue(null);

      const result = await service.crawl('manual');

      expect(result.status).toBe('success');
      expect(result.new_count).toBe(1);
      expect(announcementModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          seq: '100',
          title: '테스트 공공분양',
          status: '진행중',
          s3_pdf_keys: ['announcements/100/doc.pdf'],
          analysis_status: 'pending'
        })
      );
      expect(crawlRunModel.create).toHaveBeenCalledWith(
        expect.objectContaining({
          source: 'manual',
          status: 'success',
          new_count: 1
        })
      );
    });

    it('should skip existing announcements', async () => {
      scraperService.fetchListPage.mockResolvedValue([
        { seq: '100', title: '기존 공고', status: '진행중', detail_url: 'https://example.com/100', date: '2025-01-15' }
      ]);
      announcementModel.findOne.mockResolvedValue({ seq: '100', status: '진행중' });

      const result = await service.crawl('schedule');

      expect(result.status).toBe('success');
      expect(result.new_count).toBe(0);
      expect(scraperService.fetchDetailPage).not.toHaveBeenCalled();
    });

    it('should update status when announcement is closed', async () => {
      scraperService.fetchListPage.mockResolvedValue([
        { seq: '100', title: '마감된 공고', status: '마감', detail_url: 'https://example.com/100', date: '2025-01-10' }
      ]);
      announcementModel.findOne.mockResolvedValue({ seq: '100', status: '진행중' });

      const result = await service.crawl('schedule');

      expect(result.status).toBe('success');
      expect(result.updated_count).toBe(1);
      expect(announcementModel.updateOne).toHaveBeenCalledWith(
        { seq: '100' },
        { status: '마감', updated_at: expect.any(Date) }
      );
    });

    it('should prevent concurrent crawls', async () => {
      scraperService.fetchListPage.mockImplementation(
        () => new Promise((resolve) => setTimeout(() => resolve([]), 100))
      );

      const crawl1 = service.crawl('schedule');
      const crawl2 = service.crawl('manual');

      const [, result2] = await Promise.all([crawl1, crawl2]);

      expect(result2.status).toBe('failed');
      expect(result2.error_message).toBe('Crawl already in progress');
    });

    it('should handle scraper errors gracefully', async () => {
      scraperService.fetchListPage.mockRejectedValue(new Error('Network timeout'));

      const result = await service.crawl('schedule');

      expect(result.status).toBe('failed');
      expect(result.error_message).toBe('Network timeout');
      expect(crawlRunModel.create).toHaveBeenCalledWith(
        expect.objectContaining({ status: 'failed', error_message: 'Network timeout' })
      );
    });
  });
});
