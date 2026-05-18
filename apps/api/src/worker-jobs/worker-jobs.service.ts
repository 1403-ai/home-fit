import { Injectable, Logger } from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import { Connection, Model } from 'mongoose';
import { WorkerJobRun } from './worker-job-run.schema';

export interface WorkerJobResult {
  id: string;
  source: 'schedule' | 'manual';
  status: 'success' | 'failed';
  mongo: {
    connected: boolean;
    readyState: number;
    database: string;
  };
  started_at: string;
  completed_at: string;
  message: string;
}

@Injectable()
export class WorkerJobsService {
  private readonly logger = new Logger(WorkerJobsService.name);

  constructor(
    @InjectConnection() private readonly connection: Connection,
    @InjectModel(WorkerJobRun.name) private readonly workerJobRunModel: Model<WorkerJobRun>
  ) {}

  async run(source: 'schedule' | 'manual'): Promise<WorkerJobResult> {
    const startedAt = new Date().toISOString();
    const mongoConnected = this.connection.readyState === 1;
    const message = `Worker ${source} trigger executed`;

    const run = await this.workerJobRunModel.create({
      source,
      status: mongoConnected ? 'success' : 'failed',
      mongo_ready_state: this.connection.readyState,
      database: this.connection.name,
      started_at: startedAt,
      completed_at: new Date().toISOString(),
      message
    });

    this.logger.log(
      `${message} (status=${run.status}, readyState=${run.mongo_ready_state}, database=${run.database})`
    );

    return {
      id: run._id.toString(),
      source: run.source,
      status: run.status,
      mongo: {
        connected: mongoConnected,
        readyState: run.mongo_ready_state,
        database: run.database
      },
      started_at: run.started_at,
      completed_at: run.completed_at,
      message
    };
  }
}
