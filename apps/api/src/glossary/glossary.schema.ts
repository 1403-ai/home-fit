import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type GlossaryEntryDocument = HydratedDocument<GlossaryEntry>;

@Schema({ timestamps: true, collection: 'glossary' })
export class GlossaryEntry {
  @Prop({ required: true, unique: true })
  term: string;

  @Prop({ required: true, enum: ['소득기준', '주택정보', '자격요건', '공급유형'] })
  category: '소득기준' | '주택정보' | '자격요건' | '공급유형';

  @Prop({ required: true })
  description: string;

  @Prop({ type: [String], default: [] })
  related: string[];

  @Prop()
  updated_at: string;
}

export const GlossaryEntrySchema = SchemaFactory.createForClass(GlossaryEntry);
