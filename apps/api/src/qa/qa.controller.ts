import { Controller, Get, Param } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { QAService } from './qa.service';

@ApiTags('Q&A')
@Controller('announcements')
export class QAController {
  constructor(private readonly qaService: QAService) {}

  @Get(':seq/qa')
  @ApiOperation({ summary: '공고별 Q&A 상태 머신 조회' })
  async getStateMachine(@Param('seq') seq: string) {
    return this.qaService.findByAnnouncementSeq(seq);
  }
}
