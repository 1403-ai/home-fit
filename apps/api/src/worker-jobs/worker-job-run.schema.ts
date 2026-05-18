import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type WorkerJobRunDocument = HydratedDocument<WorkerJobRun>;

@Schema({ timestamps: true })
export class WorkerJobRun {
  @Prop({ required: true })
  source: 'schedule' | 'manual';

  @Prop({ required: true })
  status: 'success' | 'failed';

  @Prop({ required: true })
  mongo_ready_state: number;

  @Prop({ required: true })
  database: string;

  @Prop({ required: true })
  started_at: string;

  @Prop({ required: true })
  completed_at: string;

  @Prop()
  message?: string;
}

export const WorkerJobRunSchema = SchemaFactory.createForClass(WorkerJobRun);
