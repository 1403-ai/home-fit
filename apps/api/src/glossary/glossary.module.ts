import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { GlossaryEntry, GlossaryEntrySchema } from './glossary.schema';
import { GlossaryController } from './glossary.controller';
import { GlossaryService } from './glossary.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: GlossaryEntry.name, schema: GlossaryEntrySchema }
    ])
  ],
  controllers: [GlossaryController],
  providers: [GlossaryService]
})
export class GlossaryModule {}
