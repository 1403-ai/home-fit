import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GlossaryEntry, GlossaryEntryDocument } from './glossary.schema';

@Injectable()
export class GlossaryService {
  constructor(
    @InjectModel(GlossaryEntry.name)
    private readonly glossaryModel: Model<GlossaryEntryDocument>
  ) {}

  async findAll(category?: string) {
    const query: Record<string, string> = {};
    if (category) query.category = category;

    return this.glossaryModel.find(query).sort({ term: 1 }).lean().exec();
  }
}
