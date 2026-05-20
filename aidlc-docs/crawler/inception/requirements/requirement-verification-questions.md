# Requirements Verification Questions

SH 서울주택도시공사 크롤링 기능 (AWS Lambda + EventBridge) 구현을 위한 요구사항 확인 질문입니다.
각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.

---

## Question 1
크롤링 대상 범위는 어떻게 설정하나요?

A) 임대 공고만 (장기전세, 국민임대, 행복주택 등)
B) 분양 공고만
C) 임대 + 분양 모두 (스펙 문서 기준)
X) Other (please describe after [Answer]: tag below)

[Answer]: C

## Question 2
크롤링 주기는 어떻게 설정하나요?

A) 1시간마다
B) 3시간마다
C) 6시간마다
D) 12시간마다 (하루 2회)
E) 24시간마다 (하루 1회)
X) Other (please describe after [Answer]: tag below)

[Answer]: D

## Question 3
이번 구현 범위에 PDF 분석(AI 파이프라인)까지 포함하나요, 아니면 크롤링(새 공고 감지 + PDF URL 저장)까지만 구현하나요?

A) 크롤링만 (새 공고 감지 → MongoDB에 공고 메타데이터 + PDF URL 저장)
B) 크롤링 + PDF 다운로드 (S3에 PDF 저장까지)
C) 크롤링 + PDF 다운로드 + AI 분석 파이프라인 전체
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 4
Lambda 함수의 런타임 언어는 무엇으로 하나요?

A) TypeScript (Node.js) - 기존 프로젝트와 동일 언어
B) Python - 크롤링/스크래핑에 강점
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 5
크롤링 결과를 저장할 MongoDB는 기존 EC2의 Docker Compose MongoDB를 사용하나요?

A) 기존 EC2 MongoDB 사용 (Lambda에서 EC2 MongoDB로 직접 연결)
B) AWS DocumentDB 사용 (관리형 MongoDB 호환 서비스)
C) MongoDB Atlas 사용 (클라우드 관리형)
X) Other (please describe after [Answer]: tag below)

[Answer]: 크롤링 결과를 굳이 저장할 필요없고 크롤링 성공한 pdf 파일만 s3에 저장

## Question 6
인프라 프로비저닝은 어떤 방식으로 관리하나요?

A) 기존 aws-infra/ Terraform에 Lambda + EventBridge 리소스 추가
B) 별도 Terraform 모듈/디렉토리로 분리
C) AWS SAM (Serverless Application Model) 사용
D) AWS CDK 사용
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 7
SH 웹사이트 크롤링 시 차단 방지 전략이 필요한가요?

A) 기본 HTTP 요청만 (User-Agent 헤더 설정 정도)
B) 요청 간 딜레이 + 랜덤 User-Agent 로테이션
C) 프록시 사용까지 고려
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 8
새 공고 감지 시 알림 기능이 이번 범위에 포함되나요?

A) 알림 없음 (크롤링 + 저장만)
B) CloudWatch 로그/메트릭만 (모니터링용)
C) SNS/SES를 통한 관리자 알림 포함
X) Other (please describe after [Answer]: tag below)

[Answer]: A

## Question 9: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용할까요?

A) Yes — 모든 SECURITY 규칙을 blocking constraint로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No — SECURITY 규칙 스킵 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: B

## Question 10: Property-Based Testing Extension
이 프로젝트에 Property-Based Testing (PBT) 규칙을 적용할까요?

A) Yes — 모든 PBT 규칙을 blocking constraint로 적용 (비즈니스 로직, 데이터 변환, 직렬화, 상태 관리 컴포넌트가 있는 프로젝트에 권장)
B) Partial — 순수 함수와 직렬화 round-trip에만 PBT 규칙 적용
C) No — PBT 규칙 스킵 (단순 CRUD, UI 전용, 얇은 통합 레이어에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: C
