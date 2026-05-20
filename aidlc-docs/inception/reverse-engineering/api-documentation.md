# API Documentation

## REST APIs

### Health Check
- **Method**: GET
- **Path**: /api/health
- **Purpose**: 서비스 및 MongoDB 연결 상태 확인
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
  "timestamp": "2025-01-20T10:00:00.000Z"
}
```

### Worker Manual Trigger
- **Method**: POST
- **Path**: /api/worker/trigger
- **Purpose**: Worker Job 수동 실행
- **Request**: None (body 없음)
- **Response**:
```json
{
  "job": {
    "id": "ObjectId string",
    "source": "manual",
    "status": "success" | "failed",
    "mongo": {
      "connected": true,
      "readyState": 1,
      "database": "homefit"
    },
    "started_at": "ISO timestamp",
    "completed_at": "ISO timestamp",
    "message": "Worker manual trigger executed"
  }
}
```

## Internal APIs

### WorkerJobsService
- **Methods**:
  - `run(source: 'schedule' | 'manual'): Promise<WorkerJobResult>` - Job 실행 및 DB 기록
- **Parameters**: source - 트리거 출처 (스케줄 또는 수동)
- **Return Types**: WorkerJobResult (id, source, status, mongo, started_at, completed_at, message)

### WorkerService
- **Methods**:
  - `onModuleInit(): void` - 초기화 시 로그 출력
  - `runScheduledJob(): Promise<void>` - 60초 간격 스케줄 실행 (@Interval)

## Data Models

### WorkerJobRun (MongoDB Collection: workerjobruns)
- **Fields**:
  - `source`: 'schedule' | 'manual' - 트리거 출처
  - `status`: 'success' | 'failed' - 실행 결과
  - `mongo_ready_state`: number - MongoDB readyState
  - `database`: string - 데이터베이스 이름
  - `started_at`: string - 시작 시각 (ISO)
  - `completed_at`: string - 완료 시각 (ISO)
  - `message`: string (optional) - 실행 메시지
  - `createdAt`, `updatedAt`: Date (자동, timestamps: true)
- **Relationships**: 독립 컬렉션 (다른 모델과 관계 없음)
- **Validation**: source, status, mongo_ready_state, database, started_at, completed_at 필수
