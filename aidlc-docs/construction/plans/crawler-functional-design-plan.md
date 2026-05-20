# Crawler Functional Design Plan

## 설계 항목

- [x] 1. 도메인 엔티티 설계 (Announcement, CrawlRun)
- [x] 2. 크롤링 비즈니스 로직 모델 설계
- [x] 3. 비즈니스 규칙 및 상태 전이 정의
- [x] 4. 모듈 구조 및 의존성 설계

---

## 확인 질문

### Question 1
SH 웹사이트의 분양 게시판 URL 구조를 알고 계신가요? (크롤링 대상 URL)

A) 알고 있음 — 구체적 URL을 [Answer]: 뒤에 기재해 주세요
B) 모름 — AI가 SH 공식 사이트(www.i-sh.co.kr)에서 분양 게시판을 탐색하여 결정
X) Other (please describe after [Answer]: tag below)

[Answer]: https://www.i-sh.co.kr/main/lay2/program/S1T294C295/www/brd/m_241/list.do?multi_itm_seqs=1,2,4,8,16,32,64,128,256,512,1024

---

### Question 2
PDF 다운로드 후 저장 방식은 어떻게 할까요?

A) 메모리 버퍼로 처리 후 AI 분석 서비스에 전달 (디스크 저장 없음)
B) 로컬 파일시스템에 임시 저장 후 분석 완료 시 삭제
C) 영구 저장 (S3 또는 로컬 디스크)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

### Question 3
AI 분석 파이프라인 트리거 방식은 어떻게 할까요? (이번 크롤러 구현 범위에서)

A) 분석 서비스의 메서드를 직접 호출 (동일 프로세스 내)
B) 이벤트/큐 기반으로 비동기 트리거 (BullMQ 등)
C) 분석 상태만 "pending"으로 마킹하고, 별도 분석 Worker가 폴링하는 구조
X) Other (please describe after [Answer]: tag below)

[Answer]: AI 분석 파이프라인이 S3 변경사항 감지해서 트리거 되는 플로우로 (이건 이번 작업범위는아님)
