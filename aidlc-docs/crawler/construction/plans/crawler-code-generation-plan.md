# Code Generation Plan - SH Crawler Lambda

## Unit Context

- **Unit**: SH 크롤러 Lambda 함수
- **Scope**: SH 서울주택도시공사 임대+분양 게시판 크롤링 → PDF 다운로드 → S3 업로드
- **Runtime**: Node.js 20 (TypeScript)
- **배포**: AWS 콘솔에서 수동 zip 업로드
- **Terraform**: 제외 (사용자 요청)

## Code Location

```
apps/crawler/              ← 새 패키지 (모노레포 내)
├── package.json
├── tsconfig.json
├── esbuild.config.mjs     ← Lambda zip 번들링 설정
├── src/
│   ├── index.ts           ← Lambda handler (진입점)
│   ├── crawler.ts         ← SH 웹사이트 크롤링 로직
│   ├── downloader.ts      ← PDF 다운로드 + S3 업로드
│   └── types.ts           ← 타입 정의
└── README.md              ← 빌드/배포 가이드
```

---

## Generation Steps

- [x] Step 1: 프로젝트 구조 생성 (package.json, tsconfig.json)
- [x] Step 2: 타입 정의 (types.ts - 공고 데이터 인터페이스)
- [x] Step 3: 크롤링 로직 (crawler.ts - SH 게시판 HTML 파싱)
- [x] Step 4: PDF 다운로드 + S3 업로드 (downloader.ts)
- [x] Step 5: Lambda 핸들러 (index.ts - 진입점, 오케스트레이션)
- [x] Step 6: 빌드 설정 (esbuild.config.mjs - Lambda zip 번들링)
- [x] Step 7: README 작성 (빌드/배포/테스트 가이드)
- [x] Step 8: 루트 package.json 워크스페이스 업데이트

---

## Step Details

### Step 1: 프로젝트 구조 생성
- `apps/crawler/package.json`: dependencies (aws-sdk v3 S3 client), devDependencies (esbuild, typescript)
- `apps/crawler/tsconfig.json`: ES2022 target, Node module resolution

### Step 2: 타입 정의
- `Announcement` 인터페이스: seq, title, boardType, pdfUrls
- `CrawlResult` 인터페이스: 크롤링 결과 (신규 공고 목록)
- `LambdaResponse` 인터페이스: Lambda 응답 형식

### Step 3: 크롤링 로직
- SH 임대 게시판 URL 크롤링 (HTTP GET)
- SH 분양 게시판 URL 크롤링 (HTTP GET)
- HTML 파싱으로 공고 목록 추출 (제목, seq, PDF 첨부파일 URL)
- User-Agent 헤더 설정

### Step 4: PDF 다운로드 + S3 업로드
- S3 ListObjects로 기존 파일 확인 (중복 감지)
- 신규 공고 PDF 다운로드 (HTTP GET, Buffer)
- S3 PutObject로 업로드 (`announcements/{boardType}/{seq}/{filename}.pdf`)
- 개별 실패 시 스킵 + 로그

### Step 5: Lambda 핸들러
- EventBridge 이벤트 수신
- crawler → downloader 오케스트레이션
- 실행 결과 요약 로그 + 응답 반환

### Step 6: 빌드 설정
- esbuild로 단일 파일 번들링 (tree-shaking, minify)
- zip 패키징 스크립트 (dist/index.zip 생성)

### Step 7: README
- 로컬 개발/테스트 방법
- 빌드 명령어
- AWS 콘솔 배포 절차
- 환경변수 설명

### Step 8: 루트 워크스페이스
- root package.json의 workspaces에 이미 `"apps/*"` 포함되어 있으므로 자동 인식
- 빌드 스크립트 추가 확인
