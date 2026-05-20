# 크롤러 기능 요구사항 확인 질문

스펙 문서(docs/home-fit-spec.md)의 3.1 공고 자동 수집 기능을 구현하기 위해 몇 가지 확인이 필요합니다.
각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.

---

## Question 1
크롤링 주기를 어떻게 설정할까요? (스펙에서 "n시간 주기"로 명시)

A) 1시간 간격
B) 3시간 간격
C) 6시간 간격
D) 12시간 간격
X) Other (please describe after [Answer]: tag below)

[Answer]: D

---

## Question 2
크롤링 대상 SH 게시판의 범위는 어떻게 할까요?

A) 임대 게시판만 (장기전세, 국민임대, 행복주택 등)
B) 분양 게시판만
C) 임대 + 분양 모두 (스펙 명시 사항)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3
크롤링 시 PDF 파일 처리 범위는 이번 구현에 어디까지 포함할까요?

A) 크롤링만 (공고 목록 수집 + PDF URL 저장까지만, AI 분석은 별도 구현)
B) 크롤링 + PDF 다운로드 저장까지
C) 크롤링 + PDF 다운로드 + AI 분석 파이프라인 트리거까지 (전체 파이프라인)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 4
중복 공고 감지 방식은 어떻게 할까요?

A) 공고 고유번호(seq) 기반 중복 체크
B) 공고 제목 + 게시일 조합으로 중복 체크
C) URL 기반 중복 체크
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 5
크롤링 실패 시 재시도 정책은 어떻게 할까요?

A) 즉시 1회 재시도 후 실패 기록
B) 지수 백오프(exponential backoff)로 최대 3회 재시도
C) 재시도 없이 실패 기록만 남기고 다음 주기에 재시도
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 6
크롤링 결과 저장 시 공고 상태 관리는 어떻게 할까요?

A) 새 공고만 추가 (기존 공고 상태 변경 없음)
B) 새 공고 추가 + 마감된 공고 상태 업데이트 (진행중 → 마감)
C) 새 공고 추가 + 마감 업데이트 + 삭제된 공고 처리
X) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 7
현재 Worker가 60초 간격으로 실행 중인데, 크롤링 스케줄링을 어떻게 통합할까요?

A) 기존 Worker의 @Interval을 크롤링 주기로 변경
B) 기존 Worker와 별도로 @Cron 데코레이터를 사용한 새 스케줄러 추가
C) 기존 60초 Worker는 유지하고, 크롤링은 별도 Cron 기반으로 추가
X) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 8: Property-Based Testing Extension
이 프로젝트에 Property-Based Testing (PBT) 규칙을 적용할까요?

A) Yes — 모든 PBT 규칙을 blocking constraint로 적용 (비즈니스 로직, 데이터 변환, 직렬화, 상태 관리 컴포넌트가 있는 프로젝트에 권장)
B) Partial — 순수 함수와 직렬화 round-trip에만 PBT 규칙 적용 (알고리즘 복잡도가 제한적인 프로젝트에 적합)
C) No — 모든 PBT 규칙 스킵 (단순 CRUD, UI 전용, 또는 비즈니스 로직이 거의 없는 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 9: Security Extensions
이 프로젝트에 Security 확장 규칙을 적용할까요?

A) Yes — 모든 SECURITY 규칙을 blocking constraint로 적용 (프로덕션 등급 애플리케이션에 권장)
B) No — 모든 SECURITY 규칙 스킵 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: POC 레벨 애플리케이션이라 필요없음
