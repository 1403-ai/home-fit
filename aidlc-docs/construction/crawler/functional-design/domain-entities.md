# Domain Entities

## 1. Announcement (공고)

공고 게시판에서 수집한 개별 공고 정보를 나타내는 엔티티.

### Schema

```typescript
{
  // 식별자
  seq: string;              // 공고 고유번호 (SH 게시판 기준, unique index)
  
  // 기본 정보
  title: string;            // 공고 제목
  housing_type: string;     // 주택 유형 (예: "공공분양", "신혼희망타운" 등)
  supply_category: "분양";  // 공급 유형 (현재 분양만)
  
  // 상태
  status: "진행중" | "예정" | "마감";  // 공고 상태
  
  // 일정
  application_start: string | null;  // 접수 시작일 (YYYY-MM-DD)
  application_end: string | null;    // 접수 마감일 (YYYY-MM-DD)
  
  // URL
  detail_url: string;       // 상세 페이지 URL
  pdf_urls: string[];       // 첨부 PDF URL 목록 (원본 SH 서버 URL)
  
  // PDF 저장
  s3_pdf_keys: string[];    // S3에 업로드된 PDF 키 목록
  
  // 분석 상태
  analysis_status: "pending" | "analyzing" | "completed" | "failed";
  
  // 타임스탬프
  crawled_at: Date;         // 최초 수집 일시
  updated_at: Date;         // 마지막 업데이트 일시
}
```

### Indexes
- `seq`: unique index (중복 감지용)
- `status`: 활성 공고 조회용
- `analysis_status`: 분석 대기 공고 조회용

---

## 2. CrawlRun (크롤링 실행 이력)

크롤링 작업의 실행 이력을 기록하는 엔티티.

### Schema

```typescript
{
  // 실행 정보
  source: "schedule" | "manual";  // 트리거 출처
  status: "success" | "failed";   // 실행 결과
  board: "분양";                   // 대상 게시판
  
  // 결과 통계
  new_count: number;        // 신규 공고 수
  updated_count: number;    // 상태 변경 공고 수
  total_scraped: number;    // 전체 스크래핑 건수
  
  // 에러
  error_message: string | null;  // 에러 메시지 (실패 시)
  
  // 타임스탬프
  started_at: Date;         // 시작 시각
  completed_at: Date;       // 완료 시각
}
```

### Indexes
- `started_at`: 최근 실행 이력 조회용
- `status`: 실패 이력 필터링용
