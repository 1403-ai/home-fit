# 크롤러 기능 요구사항 명세

## Intent Analysis

| 항목 | 내용 |
|------|------|
| **User Request** | SH 서울주택도시공사 분양 게시판 크롤링 기능 구현 |
| **Request Type** | New Feature |
| **Scope** | Multiple Components (Worker, Crawler Module, Announcement Schema, PDF Pipeline) |
| **Complexity** | Moderate |
| **Project Type** | Brownfield (기존 NestJS Worker 인프라 활용) |

---

## 1. 기능 요구사항 (Functional Requirements)

### FR-1: 분양 게시판 크롤링

| ID | 요구사항 |
|----|----------|
| FR-1.1 | SH 서울주택도시공사 분양 게시판의 공고 목록을 HTTP 요청으로 수집한다 |
| FR-1.2 | 각 공고에서 고유번호(seq), 제목, 게시일, 상세 페이지 URL을 추출한다 |
| FR-1.3 | 공고 상세 페이지에서 PDF 첨부파일 URL을 추출한다 |
| FR-1.4 | 수집 대상은 **분양 게시판**으로 한정한다 |

### FR-2: 중복 감지 및 상태 관리

| ID | 요구사항 |
|----|----------|
| FR-2.1 | 공고 고유번호(seq) 기반으로 중복 여부를 판단한다 |
| FR-2.2 | 새로운 공고가 감지되면 DB에 저장한다 |
| FR-2.3 | 기존 공고가 마감 상태로 변경되면 DB의 status를 "마감"으로 업데이트한다 |
| FR-2.4 | status가 "마감" 또는 "공지"인 공고는 활성 목록에서 제외한다 |

### FR-3: 스케줄링

| ID | 요구사항 |
|----|----------|
| FR-3.1 | 12시간 간격으로 자동 크롤링을 실행한다 |
| FR-3.2 | 기존 Worker의 @Interval 스케줄러를 크롤링 주기(12시간)로 변경한다 |
| FR-3.3 | 수동 트리거(POST /api/worker/trigger)도 지원한다 |

### FR-4: PDF 분석 파이프라인 트리거

| ID | 요구사항 |
|----|----------|
| FR-4.1 | 새 공고 감지 시 PDF 다운로드를 수행한다 |
| FR-4.2 | PDF 다운로드 완료 후 AI 분석 파이프라인을 트리거한다 |
| FR-4.3 | 분석 파이프라인 트리거는 비동기로 처리한다 (크롤링 완료를 블로킹하지 않음) |
| FR-4.4 | 공고의 분석 상태를 추적한다 (pending → analyzing → completed → failed) |

### FR-5: 에러 처리

| ID | 요구사항 |
|----|----------|
| FR-5.1 | 크롤링 실패 시 재시도 없이 실패를 기록하고 다음 주기에 재시도한다 |
| FR-5.2 | 크롤링 실행 결과(성공/실패, 신규 공고 수, 상태 변경 수)를 로그로 기록한다 |
| FR-5.3 | 크롤링 실행 이력을 DB에 저장한다 (WorkerJobRun 활용) |

---

## 2. 비기능 요구사항 (Non-Functional Requirements)

### NFR-1: 성능
- 크롤링 1회 실행 시 30초 이내 완료 (네트워크 지연 제외)
- SH 서버에 과도한 부하를 주지 않도록 요청 간 적절한 딜레이 적용

### NFR-2: 안정성
- 크롤링 실패가 Worker 프로세스 전체를 중단시키지 않아야 함
- 네트워크 오류, HTML 구조 변경 등 예외 상황에 대한 graceful 처리

### NFR-3: 유지보수성
- SH 웹사이트 HTML 구조 변경 시 파싱 로직만 수정하면 되도록 모듈화
- 크롤링 대상 게시판 추가가 용이한 구조 (향후 임대 게시판 추가 대비)

### NFR-4: 관찰 가능성 (Observability)
- 크롤링 실행마다 상세 로그 출력 (시작, 완료, 신규 공고 수, 에러)
- 실행 이력 DB 저장으로 모니터링 가능

---

## 3. 데이터 모델

### Announcement (공고)

| 필드 | 타입 | 설명 |
|------|------|------|
| seq | string (unique) | 공고 고유번호 |
| title | string | 공고 제목 |
| housing_type | string | 주택 유형 |
| supply_category | "분양" | 공급 유형 (현재 분양만) |
| status | "진행중" \| "예정" \| "마감" | 공고 상태 |
| application_start | string \| null | 접수 시작일 (YYYY-MM-DD) |
| application_end | string \| null | 접수 마감일 |
| detail_url | string | 상세 페이지 URL |
| pdf_urls | string[] | 첨부 PDF URL 목록 |
| analysis_status | "pending" \| "analyzing" \| "completed" \| "failed" | AI 분석 상태 |
| crawled_at | Date | 최초 수집 일시 |
| updated_at | Date | 마지막 업데이트 일시 |

### CrawlRun (크롤링 실행 이력)

| 필드 | 타입 | 설명 |
|------|------|------|
| source | "schedule" \| "manual" | 트리거 출처 |
| status | "success" \| "failed" | 실행 결과 |
| board | "분양" | 대상 게시판 |
| new_count | number | 신규 공고 수 |
| updated_count | number | 상태 변경 공고 수 |
| error_message | string \| null | 에러 메시지 |
| started_at | Date | 시작 시각 |
| completed_at | Date | 완료 시각 |

---

## 4. 기술 결정사항

| 항목 | 결정 |
|------|------|
| HTTP 클라이언트 | 기존 프로젝트 스타일에 맞춰 선정 (axios 또는 node-fetch) |
| HTML 파싱 | cheerio (경량 서버사이드 DOM 파싱) |
| 스케줄링 | @nestjs/schedule의 @Interval (12시간 = 43,200,000ms) |
| 데이터 저장 | MongoDB (기존 인프라 활용) |
| PDF 저장 | 로컬 파일시스템 또는 메모리 버퍼 (분석 후 삭제) |

---

## 5. 범위 제외 (Out of Scope)

- 임대 게시판 크롤링 (향후 확장)
- AI PDF 분석 로직 자체 구현 (트리거만 구현, 분석 로직은 별도)
- 사용자 알림 기능
- 프론트엔드 공고 목록 UI
- Property-Based Testing
- Security 확장 규칙 (POC 레벨)

---

## 6. Extension Configuration

| Extension | Enabled | Decided At |
|-----------|---------|------------|
| Property-Based Testing | No | Requirements Analysis |
| Security Baseline | No | Requirements Analysis |
