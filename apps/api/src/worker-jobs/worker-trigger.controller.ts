import { Controller, Post } from '@nestjs/common';
import { CrawlerService } from '../crawler/crawler.service';

@Controller('worker')
export class WorkerTriggerController {
  constructor(private readonly crawlerService: CrawlerService) {}

  @Post('trigger')
  async trigger() {
    const result = await this.crawlerService.crawl('manual');
    return { job: result };
  }
}
