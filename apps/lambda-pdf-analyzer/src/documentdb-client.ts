import { MongoClient } from 'mongodb';
import { AnalysisResult } from './types';
import * as fs from 'fs';
import * as path from 'path';

let cachedClient: MongoClient | null = null;

function getConnectionUri(): string {
  const endpoint = process.env.DOCDB_ENDPOINT;
  const port = process.env.DOCDB_PORT || '27017';
  const username = process.env.DOCDB_USERNAME;
  const password = process.env.DOCDB_PASSWORD;
  const database = process.env.DOCDB_DATABASE || 'homefit';

  if (!endpoint || !username || !password) {
    throw new Error('DocumentDB connection env vars required: DOCDB_ENDPOINT, DOCDB_USERNAME, DOCDB_PASSWORD');
  }

  return `mongodb://${username}:${password}@${endpoint}:${port}/${database}?tls=true&replicaSet=rs0&readPreference=secondaryPreferred&retryWrites=false`;
}

function getTlsCaFile(): string {
  // Lambda 환경에서는 /opt 또는 /tmp에 CA 번들을 배치
  const possiblePaths = [
    path.join(__dirname, 'global-bundle.pem'),
    '/opt/global-bundle.pem',
    '/tmp/global-bundle.pem'
  ];

  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }

  throw new Error('DocumentDB CA certificate not found');
}

async function getClient(): Promise<MongoClient> {
  if (cachedClient) {
    return cachedClient;
  }

  const uri = getConnectionUri();
  const tlsCAFile = getTlsCaFile();

  cachedClient = new MongoClient(uri, {
    tls: true,
    tlsCAFile,
    connectTimeoutMS: 10000,
    serverSelectionTimeoutMS: 10000,
    authMechanism: 'SCRAM-SHA-1'
  });

  await cachedClient.connect();
  return cachedClient;
}

export async function saveToDocumentDB(result: AnalysisResult): Promise<void> {
  const client = await getClient();
  const db = client.db(process.env.DOCDB_DATABASE || 'homefit');

  // 1. 공고 목록 저장 (upsert by seq)
  if (result.announcements.length > 0) {
    const announcementsCol = db.collection('announcements');
    const bulkOps = result.announcements.map((announcement) => ({
      updateOne: {
        filter: { seq: announcement.seq },
        update: {
          $set: {
            ...announcement,
            updated_at: new Date().toISOString()
          }
        },
        upsert: true
      }
    }));
    await announcementsCol.bulkWrite(bulkOps);
    console.log(`Upserted ${result.announcements.length} announcements`);
  }

  // 2. Q&A 상태 머신 저장 (공고 seq 기준)
  if (result.qa_state_machine && result.announcements.length > 0) {
    const stateMachinesCol = db.collection('qa_state_machines');
    const seq = result.announcements[0].seq;
    await stateMachinesCol.updateOne(
      { announcement_seq: seq },
      {
        $set: {
          announcement_seq: seq,
          ...result.qa_state_machine,
          updated_at: new Date().toISOString()
        }
      },
      { upsert: true }
    );
    console.log(`Upserted Q&A state machine for seq: ${seq}`);
  }

  // 3. 용어 사전 저장 (upsert by term)
  if (result.glossary.length > 0) {
    const glossaryCol = db.collection('glossary');
    const bulkOps = result.glossary.map((entry) => ({
      updateOne: {
        filter: { term: entry.term },
        update: {
          $set: {
            ...entry,
            updated_at: new Date().toISOString()
          }
        },
        upsert: true
      }
    }));
    await glossaryCol.bulkWrite(bulkOps);
    console.log(`Upserted ${result.glossary.length} glossary entries`);
  }
}
