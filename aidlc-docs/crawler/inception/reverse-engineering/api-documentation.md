# API Documentation

## REST APIs

### Health Check
- **Method**: GET
- **Path**: /api/health
- **Purpose**: 서비스 상태 및 MongoDB 연결 확인
- **Request**: None
- **Response**:
```json
{
  "status": "ok" | "degraded",
  "service": "home-fit-ai-api",
  "mongo": {
    "connected": true,
    "readyState": 1,
    "database": "homefit"
  },
  "timestamp": "2026-05-20T00:00:00.000Z"
}
```

### Worker Manual Trigger
- **Method**: POST
- **Path**: /api/worker/trigger
- **Purpose**: Worker 작업 수동 실행
- **Request**: None
- **Response**:
```json
{
  "job": {
    "id": "ObjectId",
    "source": "manual",
    "status": "success" | "failed",
    "mongo": {
      "connected": true,
      "readyState": 1,
      "database": "homefit"
    },
    "started_at": "ISO8601",
    "completed_at": "ISO8601",
    "message": "Worker manual trigger executed"
  }
}
```

## Internal APIs

### WorkerJobsService
- **Methods**:
  - `run(source: 'schedule' | 'manual'): Promise<WorkerJobResult>` - 작업 실행 및 결과 기록

### WorkerService
- **Methods**:
  - `onModuleInit()` - 초기화 로그
  - `runScheduledJob()` - 60초 간격 스케줄 작업 (WorkerJobsService.run 호출)

## Data Models

### WorkerJobRun (MongoDB Collection: workerjobruns)
- **Fields**:
  - `source`: 'schedule' | 'manual' - 트리거 소스
  - `status`: 'success' | 'failed' - 실행 결과
  - `mongo_ready_state`: number - MongoDB 연결 상태
  - `database`: string - 데이터베이스 이름
  - `started_at`: string - 시작 시각 (ISO 8601)
  - `completed_at`: string - 완료 시각 (ISO 8601)
  - `message`: string (optional) - 실행 메시지
  - `createdAt`, `updatedAt`: Date (Mongoose timestamps)
- **Relationships**: None (standalone)
- **Validation**: source, status, mongo_ready_state, database, started_at, completed_at required
