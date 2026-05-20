# 요구사항 확인 질문

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 태그 뒤에 선택지 문자를 입력해 주세요.

## Question 1
"내 정보" 패널의 위치는 어디에 표시되어야 하나요?

A) 질문 카드 오른쪽에 사이드 패널로 표시 (데스크톱에서는 옆에, 모바일에서는 접히는 형태)
B) 질문 카드 위에 토글 가능한 섹션으로 표시
C) 화면 하단에 고정된 토글 패널로 표시
D) 기존 "프로필에서 자동 적용된 정보" 영역을 확장하여 전체 프로필 정보를 토글로 표시
X) Other (please describe after [Answer]: tag below)

[Answer]: A 

## Question 2
"내 정보를 아직 입력하지 않았다면 입력하도록 유도"의 구체적인 동작은 무엇인가요?

A) 온보딩 페이지(/onboarding)로 이동하는 링크/버튼 표시
B) 마이 프로필 페이지(/my-profile)로 이동하는 링크/버튼 표시
C) 질문 페이지 내에서 간단한 인라인 폼으로 바로 입력 가능하도록 함
D) 모달/팝업으로 프로필 입력 폼을 표시
X) Other (please describe after [Answer]: tag below)

[Answer]: A 

## Question 3
숫자 input의 comma 포맷은 어떤 범위에 적용하나요?

A) Q&A 질문의 숫자 입력 필드에만 적용 (현재 QuestionsPage의 number input)
B) 프로젝트 전체의 모든 숫자 입력 필드에 적용 (온보딩, 마이프로필 포함)
C) Q&A 질문 + "내 정보" 패널에 표시되는 숫자값 모두에 적용
X) Other (please describe after [Answer]: tag below)

[Answer]: B 

## Question 4: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용해야 하나요?

A) 예 — 모든 SECURITY 규칙을 차단 제약으로 적용 (프로덕션 수준 애플리케이션에 권장)
B) 아니오 — 모든 SECURITY 규칙 건너뛰기 (PoC, 프로토타입, 실험적 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: SKIP 

## Question 5: Property-Based Testing Extension
이 프로젝트에 속성 기반 테스트(PBT) 규칙을 적용해야 하나요?

A) 예 — 모든 PBT 규칙을 차단 제약으로 적용
B) 부분 적용 — 순수 함수와 직렬화 라운드트립에만 PBT 규칙 적용
C) 아니오 — 모든 PBT 규칙 건너뛰기 (단순 UI 프로젝트에 적합)
X) Other (please describe after [Answer]: tag below)

[Answer]: SKIP 
