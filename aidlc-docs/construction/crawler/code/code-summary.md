# Crawler Code Generation Summary

## 생성/수정 파일 목록

### 신규 생성 (8개)
| 파일 | 역할 |
|------|------|
| `apps/api/src/crawler/schemas/announcement.schema.ts` | 공고 Mongoose 스키마 |
| `apps/api/src/crawler/schemas/crawl-run.schema.ts` | 크롤링 실행 이력 스키마 |
| `apps/api/src/crawler/scraper.service.ts` | SH 게시판 HTML 파싱 서비스 |
| `apps/api/src/crawler/pdf-storage.service.ts` | PDF 다운로드 및 S3 업로드 서비스 |
| `apps/api/src/crawler/crawler.service.ts` | 크롤링 오케스트레이터 서비스 |
| `apps/api/src/crawler/crawler.module.ts` | 크롤러 NestJS 모듈 |
| `apps/api/src/crawler/scraper.service.spec.ts` | 스크래퍼 단위 테스트 |
| `apps/api/src/crawler/crawler.service.spec.ts` | 크롤러 단위 테스트 |

### 수정 (5개)
| 파일 | 변경 내용 |
|------|-----------|
| `apps/api/package.json` | axios, cheerio, @aws-sdk/client-s3 의존성 추가 |
| `apps/api/src/worker/worker.service.ts` | 12시간 스케줄, CrawlerService 호출 |
| `apps/api/src/worker/worker.module.ts` | CrawlerModule import (WorkerJobsModule 제거) |
| `apps/api/src/worker-jobs/worker-trigger.controller.ts` | CrawlerService.crawl('manual') 호출 |
| `apps/api/src/worker-jobs/worker-jobs.module.ts` | CrawlerModule import 추가 |
| `apps/api/src/app.module.ts` | CrawlerModule import 추가 |
| `docker-compose.yml` | worker 서비스에 S3 환경변수 추가 |

## 모듈 구조

```
apps/api/src/
  crawler/
    schemas/
      announcement.schema.ts    # Announcement 엔티티
      crawl-run.schema.ts       # CrawlRun 엔티티
    crawler.module.ts           # NestJS 모듈
    crawler.service.ts          # 오케스트레이터
    scraper.service.ts          # HTML 파싱
    pdf-storage.service.ts      # S3 업로드
    crawler.service.spec.ts     # 크롤러 테스트
    scraper.service.spec.ts     # 스크래퍼 테스트
```

## 환경변수

| 변수 | 설명 | 기본값 |
|------|------|--------|
| `AWS_S3_BUCKET` | PDF 저장 S3 버킷 | `home-fit-ai-pdfs` |
| `AWS_REGION` | AWS 리전 | `ap-northeast-2` |
| `AWS_ACCESS_KEY_ID` | AWS 액세스 키 | (필수) |
| `AWS_SECRET_ACCESS_KEY` | AWS 시크릿 키 | (필수) |

## 크롤링 흐름 요약

1. Worker가 12시간마다 `CrawlerService.crawl('schedule')` 호출
2. ScraperService가 SH 분양 게시판 HTML 파싱 → 공고 목록 추출
3. 각 공고에 대해 seq 기반 중복 체크
4. 신규 공고: 상세 페이지 → PDF URL 추출 → S3 업로드 → DB 저장
5. 기존 공고: 마감 상태 업데이트
6. CrawlRun 이력 저장
7. S3에 업로드된 PDF는 별도 분석 파이프라인이 S3 이벤트로 감지하여 처리
