# Home 페이지 요구사항 확인 질문

아래 질문에 답변해주세요. 각 질문의 `[Answer]:` 태그 뒤에 선택지 알파벳을 입력해주세요.

---

## Question 1
현재 HomePage.tsx에는 서비스 상태 확인(Health Check) UI가 있습니다. 새 Home 페이지로 **완전히 교체**할까요, 아니면 기존 Health Check 페이지는 별도 경로(예: `/status`)로 분리할까요?

A) 완전히 교체 — 기존 Health Check UI 제거하고 새 Intro Home으로 대체
B) 분리 — Health Check는 `/status`로 이동하고, `/`는 새 Intro Home으로 교체
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 2
GNB(Global Navigation Bar)의 "내 정보 입력하기 / 내 정보 보기" 전환 로직에서, 프로필 존재 여부는 어떻게 판단할까요?

A) 로컬 스토리지에 UserProfile 데이터가 존재하면 "내 정보 보기"로 표시
B) 로컬 스토리지에 UserProfile이 있고, 필수 필드(district, household_size 등)가 모두 채워져 있으면 "내 정보 보기"로 표시
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 3
GNB는 Home 페이지에만 표시할까요, 아니면 모든 페이지에 공통으로 표시할까요?

A) 모든 페이지에 공통 GNB 표시 (App 레벨에서 렌더링)
B) Home 페이지에만 GNB 표시
C) Home + 공고목록 페이지에만 GNB 표시
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 4
Intro 영역의 디자인 톤앤매너는 어떤 느낌을 원하시나요?

A) 밝고 친근한 느낌 — 파스텔 톤 + 귀여운 일러스트/이모지 활용
B) 깔끔하고 모던한 느낌 — 현재 teal 컬러 기반 유지 + 미니멀 아이콘
C) 따뜻하고 신뢰감 있는 느낌 — 부드러운 색상 + 집/가족 관련 일러스트
D) Other (please describe after [Answer]: tag below)

[Answer]: C

---

## Question 5
귀여운 이미지는 어떤 방식으로 넣을까요?

A) SVG 일러스트레이션 (코드로 직접 작성, 외부 의존성 없음)
B) 이모지(Emoji) 활용 (🏠🔑📋 등 큰 사이즈로 배치)
C) CSS 기반 간단한 그래픽 (그라데이션, 도형 조합)
D) Other (please describe after [Answer]: tag below)

[Answer]: A

---

## Question 6: Security Extensions
이 프로젝트에 보안 확장 규칙을 적용할까요?

A) Yes — 모든 보안 규칙을 blocking constraint로 적용 (프로덕션 수준 애플리케이션에 권장)
B) No — 보안 규칙 스킵 (PoC, 프로토타입, 실험적 프로젝트에 적합)
C) Other (please describe after [Answer]: tag below)

[Answer]: B

---

## Question 7: Property-Based Testing Extension
이 프로젝트에 Property-Based Testing(PBT) 규칙을 적용할까요?

A) Yes — 모든 PBT 규칙을 blocking constraint로 적용 (비즈니스 로직, 데이터 변환이 있는 프로젝트에 권장)
B) Partial — 순수 함수와 직렬화 round-trip에만 PBT 규칙 적용
C) No — PBT 규칙 스킵 (단순 CRUD, UI 전용 프로젝트에 적합)
D) Other (please describe after [Answer]: tag below)

[Answer]: C
