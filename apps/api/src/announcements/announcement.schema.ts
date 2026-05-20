import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AnnouncementDocument = HydratedDocument<Announcement>;

@Schema({ timestamps: true, collection: 'announcements' })
export class Announcement {
  @Prop({ required: true, unique: true })
  seq: string;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true })
  housing_type: string;

  @Prop({ required: true, enum: ['임대', '분양'] })
  supply_category: '임대' | '분양';

  @Prop({ required: true, enum: ['진행중', '예정'] })
  status: '진행중' | '예정';

  @Prop({ type: String, default: null })
  application_start: string | null;

  @Prop({ type: String, default: null })
  application_end: string | null;

  @Prop({ required: true })
  unit_count: number;

  @Prop({ type: String, default: null })
  source_url: string | null;

  @Prop()
  updated_at: string;
}

export const AnnouncementSchema = SchemaFactory.createForClass(Announcement);
