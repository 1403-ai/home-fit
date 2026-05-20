import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import axios from 'axios';
import * as path from 'path';

const REQUEST_TIMEOUT_MS = 30_000;
const USER_AGENT = 'HomeFitAI-Crawler/1.0 (+https://github.com/home-fit-ai)';

@Injectable()
export class PdfStorageService {
  private readonly logger = new Logger(PdfStorageService.name);
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor(private readonly config: ConfigService) {
    this.bucket = this.config.get<string>('AWS_S3_BUCKET', 'home-fit-ai-pdfs');

    this.s3 = new S3Client({
      region: this.config.get<string>('AWS_REGION', 'ap-northeast-2'),
      credentials: {
        accessKeyId: this.config.get<string>('AWS_ACCESS_KEY_ID', ''),
        secretAccessKey: this.config.get<string>('AWS_SECRET_ACCESS_KEY', '')
      }
    });
  }

  async uploadPdf(pdfUrl: string, seq: string): Promise<string> {
    this.logger.debug(`Downloading PDF: ${pdfUrl}`);

    const response = await axios.get(pdfUrl, {
      responseType: 'arraybuffer',
      headers: { 'User-Agent': USER_AGENT },
      timeout: REQUEST_TIMEOUT_MS
    });

    const buffer = Buffer.from(response.data);
    const filename = this.extractFilename(pdfUrl);
    const s3Key = `announcements/${seq}/${filename}`;

    this.logger.debug(`Uploading to S3: ${s3Key} (${buffer.length} bytes)`);

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: s3Key,
        Body: buffer,
        ContentType: 'application/pdf'
      })
    );

    this.logger.log(`PDF uploaded: s3://${this.bucket}/${s3Key}`);
    return s3Key;
  }

  private extractFilename(url: string): string {
    try {
      const urlPath = new URL(url).pathname;
      const basename = path.basename(urlPath);
      return basename || `document_${Date.now()}.pdf`;
    } catch {
      return `document_${Date.now()}.pdf`;
    }
  }
}
