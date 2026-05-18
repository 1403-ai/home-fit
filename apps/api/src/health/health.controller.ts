import { Controller, Get } from '@nestjs/common';
import { InjectConnection } from '@nestjs/mongoose';
import { Connection } from 'mongoose';

@Controller('health')
export class HealthController {
  constructor(@InjectConnection() private readonly connection: Connection) {}

  @Get()
  getHealth() {
    const mongoConnected = this.connection.readyState === 1;

    return {
      status: mongoConnected ? 'ok' : 'degraded',
      service: 'home-fit-ai-api',
      mongo: {
        connected: mongoConnected,
        readyState: this.connection.readyState,
        database: this.connection.name
      },
      timestamp: new Date().toISOString()
    };
  }
}
