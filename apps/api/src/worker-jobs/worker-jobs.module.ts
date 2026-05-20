import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { WorkerJobRun, WorkerJobRunSchema } from './worker-job-run.schema';
import { WorkerJobsService } from './worker-jobs.service';
import { WorkerTriggerController } from './worker-trigger.controller';
import { CrawlerModule } from '../crawler/crawler.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: WorkerJobRun.name,
        schema: WorkerJobRunSchema
      }
    ]),
    CrawlerModule
  ],
  controllers: [WorkerTriggerController],
  providers: [WorkerJobsService],
  exports: [WorkerJobsService]
})
export class WorkerJobsModule {}
