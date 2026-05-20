import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { QAStateMachine, QAStateMachineSchema } from './qa-state-machine.schema';
import { QAController } from './qa.controller';
import { QAService } from './qa.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: QAStateMachine.name, schema: QAStateMachineSchema }
    ])
  ],
  controllers: [QAController],
  providers: [QAService]
})
export class QAModule {}
