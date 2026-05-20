import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Announcement, AnnouncementDocument } from './announcement.schema';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectModel(Announcement.name)
    private readonly announcementModel: Model<AnnouncementDocument>
  ) {}

  async findAll(filters?: {
    housing_type?: string;
    supply_category?: string;
    status?: string;
  }) {
    const query: Record<string, string> = {};

    if (filters?.housing_type) query.housing_type = filters.housing_type;
    if (filters?.supply_category) query.supply_category = filters.supply_category;
    if (filters?.status) query.status = filters.status;

    return this.announcementModel
      .find(query)
      .sort({ application_start: -1 })
      .lean()
      .exec();
  }

  async findBySeq(seq: string) {
    return this.announcementModel.findOne({ seq }).lean().exec();
  }

  async removeBySeq(seq: string) {
    const result = await this.announcementModel.deleteOne({ seq }).exec();
    if (result.deletedCount === 0) {
      throw new NotFoundException(`공고 seq="${seq}"를 찾을 수 없습니다.`);
    }
    return { deleted: true, seq };
  }
}
