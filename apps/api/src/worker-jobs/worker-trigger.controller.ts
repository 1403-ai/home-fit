import { Controller, Post } from '@nestjs/common';
import { WorkerJobsService } from './worker-jobs.service';

@Controller('worker')
export class WorkerTriggerController {
  constructor(private readonly workerJobsService: WorkerJobsService) {}

  @Post('trigger')
  async trigger() {
    return {
      job: await this.workerJobsService.run('manual')
    };
  }
}
