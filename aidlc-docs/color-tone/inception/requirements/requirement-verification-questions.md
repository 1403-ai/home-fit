# 컬러톤 변경 요구사항 확인 질문

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.

## Question 1
온보딩 페이지의 새로운 컬러를 어떤 톤으로 변경하시겠습니까? (현재: blue-600 파랑)

A) 오렌지 계열 그대로 사용 (orange-600, 홈페이지와 동일)
B) 따뜻한 앰버/골드 계열 (amber-600, 오렌지보다 부드러운 느낌)
C) 코랄/살몬 계열 (따뜻하면서 오렌지와 구분되는 톤)
D) 테라코타/브라운 계열 (차분하고 따뜻한 어스톤)
X) Other (please describe after [Answer]: tag below)

[Answer]: B 

## Question 2
공고 목록/Q&A 페이지의 새로운 컬러를 어떤 톤으로 변경하시겠습니까? (현재: #12615f 초록/틸)

A) 오렌지 계열 그대로 사용 (orange-600, 홈페이지와 동일)
B) 따뜻한 앰버/골드 계열 (amber-700, 오렌지와 조화로운 톤)
C) 따뜻한 브라운/시에나 계열 (어스톤으로 오렌지와 자연스러운 조합)
D) 딥 오렌지/번트 오렌지 계열 (orange-800, 오렌지 계열 내 변주)
X) Other (please describe after [Answer]: tag below)

[Answer]: B 

## Question 3
전체 프로덕트에서 페이지별 컬러 구분이 필요합니까?

A) 모든 페이지를 동일한 오렌지 계열로 통일 (단일 브랜드 컬러)
B) 오렌지를 메인으로 하되, 페이지별 약간의 톤 변주 허용 (예: 온보딩은 약간 밝은 톤, 공고는 약간 진한 톤)
C) 오렌지를 메인으로 하되, 보조색(secondary)으로 다른 따뜻한 색상 사용 허용
X) Other (please describe after [Answer]: tag below)

[Answer]: B 

## Question 4
StepComplete 컴포넌트의 성공 표시 색상(현재: green-50/green-800)도 변경하시겠습니까?

A) 예, 오렌지/앰버 계열로 변경 (따뜻한 톤 유지)
B) 아니오, 성공/완료 표시는 그린 계열 유지 (UX 관례상 초록=성공)
C) 따뜻한 톤의 그린으로 변경 (예: lime/yellow-green 계열)
X) Other (please describe after [Answer]: tag below)

[Answer]: C 

## Question 5: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용하시겠습니까?

A) 예 — 모든 SECURITY 규칙을 blocking constraint로 적용 (프로덕션 수준 애플리케이션에 권장)
B) 아니오 — 모든 SECURITY 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: Skip (disabled) 

## Question 6: Property-Based Testing Extension
이 프로젝트에 속성 기반 테스팅(PBT) 규칙을 적용하시겠습니까?

A) 예 — 모든 PBT 규칙을 blocking constraint로 적용
B) 부분 적용 — 순수 함수와 직렬화 round-trip에만 PBT 규칙 적용
C) 아니오 — 모든 PBT 규칙 건너뛰기 (단순 CRUD, UI 전용 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: Skip (disabled) 
