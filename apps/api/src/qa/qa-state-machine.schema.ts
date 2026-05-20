import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type QAStateMachineDocument = HydratedDocument<QAStateMachine>;

@Schema({ timestamps: true, collection: 'qa_state_machines' })
export class QAStateMachine {
  @Prop({ required: true, unique: true })
  announcement_seq: string;

  @Prop({ required: true })
  initial: string;

  @Prop({ type: Object, required: true })
  meta: { total_questions: number };

  @Prop({ type: MongooseSchema.Types.Mixed, required: true })
  states: Record<string, unknown>;

  @Prop()
  updated_at: string;
}

export const QAStateMachineSchema = SchemaFactory.createForClass(QAStateMachine);
