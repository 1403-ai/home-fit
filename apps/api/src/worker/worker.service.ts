import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Interval } from '@nestjs/schedule';
import { Connection } from 'mongoose';
import { CrawlerService } from '../crawler/crawler.service';

const CRAWL_INTERVAL_MS = 43_200_000; // 12 hours

@Injectable()
export class WorkerService implements OnModuleInit {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly crawlerService: CrawlerService
  ) {}

  onModuleInit() {
    this.logger.log('Worker is ready for scheduled crawling jobs');
    this.logMongoState();
  }

  @Interval(CRAWL_INTERVAL_MS)
  async runScheduledJob() {
    this.logMongoState();
    const result = await this.crawlerService.crawl('schedule');
    this.logger.log(
      `Scheduled crawl finished: status=${result.status}, new=${result.new_count}, updated=${result.updated_count}, duration=${result.duration_ms}ms`
    );
  }

  private logMongoState() {
    this.logger.log(
      `MongoDB ${this.connection.readyState === 1 ? 'connected' : 'not connected'} ` +
        `(readyState=${this.connection.readyState}, database=${this.connection.name})`
    );
  }
}
