# SH 크롤러 Lambda

SH 서울주택도시공사 공고 게시판에서 임대/분양 공고 PDF를 자동 수집하여 S3에 저장하는 AWS Lambda 함수입니다.

## 아키텍처

```
EventBridge Scheduler (12시간 주기)
    → Lambda (Node.js 20, arm64, 1024MB, 900s)
        → SH 웹사이트 크롤링 (공고 목록 + 상세)
        → PDF 다운로드
        → S3 업로드 (home-fit-documents 버킷)
```

## 환경변수

| Key | Description | Example |
|-----|-------------|---------|
| `S3_BUCKET_NAME` | PDF 저장 S3 버킷 이름 | `home-fit-documents` |
| `CRAWL_MAX_LIST_PAGES` | 탐색할 목록 페이지 수. 기본값은 최신 5페이지, 전체 탐색은 `all` | `5` |
| `LAMBDA_SAFETY_BUFFER_MS` | Lambda 종료 전 작업 중단 버퍼. 기본값 30초 | `30000` |
| `LAMBDA_MIN_REMAINING_MS` | 다음 공고 처리를 시작하기 위한 최소 잔여 시간. 기본값 60초 | `60000` |
| `SH_FETCH_DELAY_MS` | 목록/상세 요청 사이 지연. 기본값 300ms | `300` |
| `SH_DOWNLOAD_DELAY_MS` | PDF 다운로드 전 지연. 기본값 300ms | `300` |

## 로컬 개발

```bash
# 의존성 설치
cd apps/crawler
npm install

# 타입 체크
npm run typecheck

# 로컬 실행 (테스트)
S3_BUCKET_NAME=home-fit-documents npm run dev
```

> 로컬 실행 시 AWS 자격증명이 필요합니다 (`~/.aws/credentials` 또는 환경변수).

## 빌드

```bash
# 번들링 (dist/index.mjs 생성)
npm run build

# 번들링 + zip 패키징 (dist/index.zip 생성)
npm run build:zip
```

빌드 결과물:
- `dist/index.mjs` - esbuild로 번들링된 단일 파일
- `dist/index.zip` - Lambda 업로드용 zip 파일

## AWS 콘솔 배포

1. `npm run build:zip` 실행
2. AWS Console → Lambda → `home-fit-crawler`
3. "Code" 탭 → "Upload from" → ".zip file"
4. `dist/index.zip` 업로드
5. Runtime settings:
   - Runtime: `Node.js 20.x`
   - Handler: `index.handler`
   - Architecture: `arm64`
6. Configuration:
   - Memory: `1024 MB`
   - Timeout: `15 min`
   - Environment variables: `S3_BUCKET_NAME=home-fit-documents`

## Lambda 설정 요약

| 항목 | 값 |
|------|-----|
| Function Name | `home-fit-crawler` |
| Runtime | Node.js 20.x |
| Architecture | arm64 |
| Handler | `index.handler` |
| Memory | 1024 MB |
| Timeout | 900초 (15분) |
| Trigger | EventBridge `rate(12 hours)` |

## IAM 권한

Lambda 실행 역할에 필요한 권한:
- `AWSLambdaBasicExecutionRole` (CloudWatch Logs)
- S3: `PutObject`, `GetObject`, `ListBucket`, `HeadObject` on `home-fit-documents` 버킷

## S3 저장 구조

```
home-fit-documents/
└── announcements/
    └── {nttId}/
        └── {filename}.pdf
```

## 동작 흐름

1. EventBridge가 12시간마다 Lambda 트리거
2. SH 공고 게시판 목록 페이지 크롤링 (기본 최신 5페이지/50건, `CRAWL_MAX_LIST_PAGES`로 확장 가능)
3. 목록의 `getDetailView(seq)` 값을 이용해 상세 페이지를 POST 요청
4. 상세 HTML의 `initParam.downList`에서 PDF 첨부파일 URL 추출
5. S3에서 기존 PDF 조회 (중복 감지)
6. PDF 다운로드 → S3 업로드
7. Lambda 잔여 시간이 부족하면 다음 공고 처리를 시작하지 않고 안전 종료
8. 실행 결과 로그 출력
