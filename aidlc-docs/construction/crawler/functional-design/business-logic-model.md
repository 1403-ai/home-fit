# Business Logic Model

## 크롤링 파이프라인 흐름

```
[Scheduler: 12시간 간격]
       |
       v
[1. 게시판 목록 페이지 요청]
       |
       v
[2. HTML 파싱 → 공고 목록 추출]
       |
       v
[3. 각 공고에 대해 중복 체크 (seq 기반)]
       |
       +-- 신규 공고 → [4a. 상세 페이지 요청 → PDF URL 추출]
       |                        |
       |                        v
       |               [5. PDF 다운로드 → S3 업로드]
       |                        |
       |                        v
       |               [6. Announcement 저장 (analysis_status: "pending")]
       |
       +-- 기존 공고 → [4b. 상태 변경 확인 (마감 여부)]
       |                        |
       |                        v
       |               [상태 변경 시 DB 업데이트]
       |
       v
[7. CrawlRun 이력 저장]
       |
       v
[완료 — S3 업로드된 PDF는 별도 분석 파이프라인이 감지하여 처리]
```

---

## 주요 컴포넌트

### CrawlerService (핵심 오케스트레이터)

```
메서드: crawl(source: "schedule" | "manual")
역할: 전체 크롤링 파이프라인 오케스트레이션
흐름:
  1. CrawlRun 시작 기록
  2. SH 게시판 목록 페이지 요청
  3. HTML에서 공고 목록 파싱
  4. 각 공고에 대해:
     - DB에서 seq로 기존 공고 조회
     - 신규: 상세 페이지 → PDF URL 추출 → PDF 다운로드 → S3 업로드 → DB 저장
     - 기존: 상태 변경 확인 → 필요 시 업데이트
  5. CrawlRun 완료 기록
  6. 결과 반환
```

### ScraperService (HTML 파싱 전담)

```
메서드: fetchListPage(url: string) → RawAnnouncement[]
역할: 게시판 목록 페이지 HTML을 파싱하여 공고 기본 정보 추출
출력: { seq, title, status, detail_url, dates }[]

메서드: fetchDetailPage(url: string) → { pdf_urls: string[] }
역할: 공고 상세 페이지에서 PDF 첨부파일 URL 추출
```

### PdfStorageService (PDF 저장 전담)

```
메서드: uploadPdf(url: string, seq: string) → string (S3 key)
역할: PDF URL에서 파일 다운로드 후 S3에 업로드
S3 키 패턴: announcements/{seq}/{filename}
```

### AnnouncementsRepository (데이터 접근)

```
메서드: findBySeq(seq: string) → Announcement | null
메서드: create(data: CreateAnnouncementDto) → Announcement
메서드: updateStatus(seq: string, status: string) → void
메서드: findActiveSeqs() → string[]  // 현재 활성 공고 seq 목록
```

---

## 요청 간 딜레이

SH 서버에 과도한 부하를 주지 않도록:
- 목록 페이지 요청 후: 1초 대기
- 상세 페이지 요청 간: 1~2초 대기
- PDF 다운로드 간: 1초 대기

---

## 에러 처리 전략

| 에러 유형 | 처리 방식 |
|-----------|-----------|
| 네트워크 타임아웃 | 해당 크롤링 실패 기록, 다음 주기에 재시도 |
| HTML 구조 변경 (파싱 실패) | 에러 로그 + CrawlRun 실패 기록 |
| PDF 다운로드 실패 | 해당 공고의 s3_pdf_keys 비워두고, analysis_status를 "failed"로 |
| S3 업로드 실패 | 위와 동일 |
| DB 저장 실패 | 전체 크롤링 실패 처리 |

모든 에러는 Worker 프로세스를 중단시키지 않으며, try-catch로 격리.
