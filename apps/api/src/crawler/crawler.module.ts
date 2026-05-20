import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Announcement, AnnouncementSchema } from './schemas/announcement.schema';
import { CrawlRun, CrawlRunSchema } from './schemas/crawl-run.schema';
import { ScraperService } from './scraper.service';
import { PdfStorageService } from './pdf-storage.service';
import { CrawlerService } from './crawler.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Announcement.name, schema: AnnouncementSchema },
      { name: CrawlRun.name, schema: CrawlRunSchema }
    ])
  ],
  providers: [ScraperService, PdfStorageService, CrawlerService],
  exports: [CrawlerService]
})
export class CrawlerModule {}
