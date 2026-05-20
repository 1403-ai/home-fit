# Crawler Code Generation Plan

## Unit Context
- **Unit**: SH 분양 게시판 크롤러
- **Target**: `apps/api/src/` (기존 NestJS 프로젝트)
- **Project Type**: Brownfield (기존 Worker 인프라 활용)
- **Dependencies**: MongoDB (기존), AWS S3 (신규), cheerio (신규), axios (신규)

## Stories Implemented
- 분양 게시판 HTML 크롤링 및 공고 목록 추출
- 공고 상세 페이지에서 PDF URL 추출
- PDF 다운로드 및 S3 업로드
- 중복 감지 (seq 기반) 및 상태 관리
- 12시간 간격 자동 스케줄링
- 수동 트리거 지원
- 크롤링 실행 이력 기록

---

## Generation Steps

### Step 1: 의존성 추가
- [x] `apps/api/package.json`에 신규 의존성 추가:
  - `axios` (HTTP 클라이언트)
  - `cheerio` (HTML 파싱)
  - `@aws-sdk/client-s3` (S3 업로드)

### Step 2: Mongoose 스키마 생성
- [x] `apps/api/src/crawler/schemas/announcement.schema.ts` 생성
- [x] `apps/api/src/crawler/schemas/crawl-run.schema.ts` 생성

### Step 3: ScraperService 생성
- [x] `apps/api/src/crawler/scraper.service.ts` 생성

### Step 4: PdfStorageService 생성
- [x] `apps/api/src/crawler/pdf-storage.service.ts` 생성

### Step 5: CrawlerService 생성 (핵심 오케스트레이터)
- [x] `apps/api/src/crawler/crawler.service.ts` 생성

### Step 6: CrawlerModule 생성
- [x] `apps/api/src/crawler/crawler.module.ts` 생성

### Step 7: Worker 통합 (기존 파일 수정)
- [x] `apps/api/src/worker/worker.service.ts` 수정
- [x] `apps/api/src/worker/worker.module.ts` 수정

### Step 8: API 통합 (기존 파일 수정)
- [x] `apps/api/src/worker-jobs/worker-trigger.controller.ts` 수정
- [x] `apps/api/src/worker-jobs/worker-jobs.module.ts` 수정
- [x] `apps/api/src/app.module.ts` 수정

### Step 9: 환경변수 설정
- [x] `docker-compose.yml`의 worker 서비스에 S3 환경변수 추가

### Step 10: 단위 테스트 생성
- [x] `apps/api/src/crawler/scraper.service.spec.ts` 생성
- [x] `apps/api/src/crawler/crawler.service.spec.ts` 생성

### Step 11: 코드 요약 문서 생성
- [x] `aidlc-docs/construction/crawler/code/code-summary.md` 생성

---

## File Summary

### 신규 생성 파일 (8개)
| 파일 | 역할 |
|------|------|
| `apps/api/src/crawler/schemas/announcement.schema.ts` | 공고 Mongoose 스키마 |
| `apps/api/src/crawler/schemas/crawl-run.schema.ts` | 크롤링 이력 스키마 |
| `apps/api/src/crawler/scraper.service.ts` | HTML 파싱 서비스 |
| `apps/api/src/crawler/pdf-storage.service.ts` | PDF S3 업로드 서비스 |
| `apps/api/src/crawler/crawler.service.ts` | 크롤링 오케스트레이터 |
| `apps/api/src/crawler/crawler.module.ts` | 크롤러 NestJS 모듈 |
| `apps/api/src/crawler/scraper.service.spec.ts` | 스크래퍼 단위 테스트 |
| `apps/api/src/crawler/crawler.service.spec.ts` | 크롤러 단위 테스트 |

### 수정 파일 (5개)
| 파일 | 변경 내용 |
|------|-----------|
| `apps/api/package.json` | axios, cheerio, @aws-sdk/client-s3 추가 |
| `apps/api/src/worker/worker.service.ts` | 스케줄 주기 변경, CrawlerService 호출 |
| `apps/api/src/worker/worker.module.ts` | CrawlerModule import |
| `apps/api/src/worker-jobs/worker-trigger.controller.ts` | CrawlerService 호출 |
| `apps/api/src/app.module.ts` | CrawlerModule import |
