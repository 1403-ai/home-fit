import { Controller, Get, Query } from '@nestjs/common';
import { ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { GlossaryService } from './glossary.service';

@ApiTags('용어 사전')
@Controller('glossary')
export class GlossaryController {
  constructor(private readonly glossaryService: GlossaryService) {}

  @Get()
  @ApiOperation({ summary: '용어 사전 전체 조회' })
  @ApiQuery({ name: 'category', required: false, enum: ['소득기준', '주택정보', '자격요건', '공급유형'] })
  async findAll(@Query('category') category?: string) {
    return this.glossaryService.findAll(category);
  }
}
