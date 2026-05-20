import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnnouncementDocument = HydratedDocument<Announcement>;

export type AnnouncementStatus = '진행중' | '예정' | '마감';
export type AnalysisStatus = 'pending' | 'analyzing' | 'completed' | 'failed';

@Schema({ timestamps: true })
export class Announcement {
  @Prop({ required: true, unique: true, index: true })
  seq: string;

  @Prop({ required: true })
  title: string;

  @Prop()
  housing_type: string;

  @Prop({ default: '분양' })
  supply_category: string;

  @Prop({ required: true, index: true })
  status: AnnouncementStatus;

  @Prop({ type: String, default: null })
  application_start: string | null;

  @Prop({ type: String, default: null })
  application_end: string | null;

  @Prop({ required: true })
  detail_url: string;

  @Prop({ type: [String], default: [] })
  pdf_urls: string[];

  @Prop({ type: [String], default: [] })
  s3_pdf_keys: string[];

  @Prop({ default: 'pending', index: true })
  analysis_status: AnalysisStatus;

  @Prop({ required: true })
  crawled_at: Date;

  @Prop({ required: true })
  updated_at: Date;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
