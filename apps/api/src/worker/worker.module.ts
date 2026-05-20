import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '../database/database.module';
import { CrawlerModule } from '../crawler/crawler.module';
import { WorkerService } from './worker.service';

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true }), ScheduleModule.forRoot(), DatabaseModule, CrawlerModule],
  providers: [WorkerService]
})
export class WorkerModule {}
