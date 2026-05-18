import { Logger } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { WorkerModule } from './worker/worker.module';

async function bootstrap() {
  const logger = new Logger('WorkerBootstrap');
  await NestFactory.createApplicationContext(WorkerModule);
  logger.log('Worker application context started');
}

void bootstrap();
