import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { HealthModule } from './health/health.module';
import { WorkerJobsModule } from './worker-jobs/worker-jobs.module';
import { AnnouncementsModule } from './announcements/announcements.module';
import { QAModule } from './qa/qa.module';
import { GlossaryModule } from './glossary/glossary.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    HealthModule,
    WorkerJobsModule,
    AnnouncementsModule,
    QAModule,
    GlossaryModule
  ]
})
export class AppModule {}
