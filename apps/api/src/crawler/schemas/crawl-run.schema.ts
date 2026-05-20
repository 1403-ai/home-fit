import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type CrawlRunDocument = HydratedDocument<CrawlRun>;

@Schema({ timestamps: true })
export class CrawlRun {
  @Prop({ required: true })
  source: 'schedule' | 'manual';

  @Prop({ required: true })
  status: 'success' | 'failed';

  @Prop({ default: '분양' })
  board: string;

  @Prop({ default: 0 })
  new_count: number;

  @Prop({ default: 0 })
  updated_count: number;

  @Prop({ default: 0 })
  total_scraped: number;

  @Prop({ type: String, default: null })
  error_message: string | null;

  @Prop({ required: true, index: true })
  started_at: Date;

  @Prop({ required: true })
  completed_at: Date;
}

export const CrawlRunSchema = SchemaFactory.createForClass(CrawlRun);
