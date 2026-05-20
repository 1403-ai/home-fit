# 멀티스텝 폼 + 로컬스토리지 요구사항 확인 질문

아래 질문에 답변해 주세요. 각 질문의 [Answer]: 뒤에 선택지 문자를 입력해 주세요.

## Question 1
스텝 간 이동 시 UI 패턴은 어떤 것을 원하시나요?

A) 이전/다음 버튼으로 컴포넌트 전환 (같은 URL 유지)
B) 각 스텝별 별도 URL (예: /onboarding/step1, /onboarding/step2, /onboarding/step3)
C) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 2
로컬스토리지 저장 시점은 언제인가요?

A) 각 스텝의 "다음" 버튼 클릭 시에만 저장
B) 각 필드 값 변경 시 실시간 저장 (자동 저장)
C) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 3
이전에 저장된 로컬스토리지 데이터가 있을 때 어떻게 처리하나요?

A) 페이지 진입 시 자동으로 불러와서 폼에 채움 (이어서 작성 가능)
B) 사용자에게 "이전 데이터가 있습니다. 불러오시겠습니까?" 확인 후 불러옴
C) 항상 빈 폼으로 시작 (로컬스토리지는 최종 제출용으로만 사용)
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 4
3단계 모두 완료 후 최종 제출 동작은 어떻게 하나요?

A) 콘솔에 JSON 출력 (현재와 동일) + 로컬스토리지에 최종 데이터 유지
B) 콘솔에 JSON 출력 + 로컬스토리지 데이터 삭제 (초기화)
C) 최종 완료 화면만 표시 (로컬스토리지 데이터 유지)
D) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 5
스텝 진행 상태 표시(Progress Indicator)가 필요한가요?

A) 예 - 상단에 스텝 인디케이터 표시 (예: Step 1/3, 프로그레스 바 등)
B) 아니오 - 별도 진행 표시 없이 컴포넌트만 전환
C) Other (please describe after [Answer]: tag below)

[Answer]: 

## Question 6
기존 OnboardingForm의 유효성 검증은 어떻게 적용하나요?

A) 각 스텝별로 해당 스텝 필드만 검증 후 다음 스텝으로 이동 가능
B) 유효성 검증 없이 자유롭게 이동 가능, 최종 제출 시에만 전체 검증
C) Other (please describe after [Answer]: tag below)

[Answer]: 
