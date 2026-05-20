import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (config: ConfigService) => {
        const uri = config.get<string>('MONGO_URI');

        if (!uri) {
          throw new Error('MONGO_URI is required');
        }

        return {
          uri,
          tls: uri.includes('docdb.amazonaws.com'),
          tlsCAFile: uri.includes('docdb.amazonaws.com')
            ? '/app/global-bundle.pem'
            : undefined,
          retryWrites: false,
          authMechanism: uri.includes('docdb.amazonaws.com')
            ? 'SCRAM-SHA-1'
            : undefined
        };
      }
    })
  ],
  exports: [MongooseModule]
})
export class DatabaseModule {}
