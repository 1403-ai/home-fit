import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Interval } from '@nestjs/schedule';
import { Connection } from 'mongoose';
import { WorkerJobsService } from '../worker-jobs/worker-jobs.service';

@Injectable()
export class WorkerService implements OnModuleInit {
  private readonly logger = new Logger(WorkerService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    private readonly workerJobsService: WorkerJobsService
  ) {}

  onModuleInit() {
    this.logger.log('Worker is ready for scheduled crawling and analysis jobs');
    this.logMongoState();
  }

  @Interval(60_000)
  async runScheduledJob() {
    this.logMongoState();
    await this.workerJobsService.run('schedule');
  }

  private logMongoState() {
    this.logger.log(
      `MongoDB ${this.connection.readyState === 1 ? 'connected' : 'not connected'} ` +
        `(readyState=${this.connection.readyState}, database=${this.connection.name})`
    );
  }
}
