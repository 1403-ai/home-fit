import { Controller, Get, Param, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { AnnouncementsService } from './announcements.service';

@ApiTags('공고')
@Controller('announcements')
export class AnnouncementsController {
  constructor(private readonly announcementsService: AnnouncementsService) {}

  @Get()
  @ApiOperation({ summary: '공고 목록 조회' })
  @ApiQuery({ name: 'housing_type', required: false, description: '주택 유형 (장기전세, 국민임대, 행복주택 등)' })
  @ApiQuery({ name: 'supply_category', required: false, enum: ['임대', '분양'] })
  @ApiQuery({ name: 'status', required: false, enum: ['진행중', '예정'] })
  async findAll(
    @Query('housing_type') housingType?: string,
    @Query('supply_category') supplyCategory?: string,
    @Query('status') status?: string
  ) {
    return this.announcementsService.findAll({
      housing_type: housingType,
      supply_category: supplyCategory,
      status
    });
  }

  @Get(':seq')
  @ApiOperation({ summary: '공고 상세 조회' })
  async findOne(@Param('seq') seq: string) {
    return this.announcementsService.findBySeq(seq);
  }
}
