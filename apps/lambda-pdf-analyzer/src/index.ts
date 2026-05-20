import { S3Event, Context } from 'aws-lambda';
import { getObjectFromS3 } from './s3-client';
import { analyzePdfWithBedrock } from './bedrock-client';
import { saveToDocumentDB } from './documentdb-client';

export async function handler(event: S3Event, context: Context): Promise<void> {
  console.log('PDF Analyzer Lambda invoked', JSON.stringify({ requestId: context.awsRequestId }));

  for (const record of event.Records) {
    const bucket = record.s3.bucket.name;
    const key = decodeURIComponent(record.s3.object.key.replace(/\+/g, ' '));

    console.log(`Processing: s3://${bucket}/${key}`);

    try {
      // 1. S3에서 PDF 파일 읽기
      const pdfBuffer = await getObjectFromS3(bucket, key);
      console.log(`PDF downloaded: ${pdfBuffer.length} bytes`);

      // 2. Bedrock Claude Opus 4로 PDF 분석
      const analysisResult = await analyzePdfWithBedrock(pdfBuffer, key);
      console.log(`Analysis complete: ${analysisResult.announcements.length} announcements found`);

      // 3. DocumentDB에 저장
      await saveToDocumentDB(analysisResult);
      console.log(`Saved to DocumentDB successfully`);
    } catch (error) {
      console.error(`Error processing ${key}:`, error);
      throw error;
    }
  }
}
