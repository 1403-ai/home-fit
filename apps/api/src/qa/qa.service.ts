import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { QAStateMachine, QAStateMachineDocument } from './qa-state-machine.schema';

@Injectable()
export class QAService {
  constructor(
    @InjectModel(QAStateMachine.name)
    private readonly qaModel: Model<QAStateMachineDocument>
  ) {}

  async findByAnnouncementSeq(seq: string) {
    const stateMachine = await this.qaModel
      .findOne({ announcement_seq: seq })
      .lean()
      .exec();

    if (!stateMachine) {
      throw new NotFoundException(
        `Q&A state machine not found for announcement: ${seq}`
      );
    }

    return stateMachine;
  }
}
