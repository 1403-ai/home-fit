# Code Generation Plan: 멀티스텝 온보딩 폼 + 로컬스토리지

## Unit Context
- **Unit Name**: multi-step-form
- **Scope**: OnboardingForm 컴포넌트를 3단계 멀티스텝 구조로 리팩토링 + 로컬스토리지 연동
- **Dependencies**: 기존 types/profile.ts, utils/validation.ts 활용
- **Target Directory**: apps/web/src/

## Step Sequence

### Step 1: 로컬스토리지 유틸리티 생성
- [x] `apps/web/src/utils/storage.ts` 생성
  - localStorage 저장/불러오기/삭제 함수
  - JSON 직렬화/역직렬화 + 에러 핸들링
  - 저장 키: `home-fit-onboarding-profile`

### Step 2: 유효성 검증 분리 (스텝별)
- [x] `apps/web/src/utils/validation.ts` 수정
  - `validateStep1(profile)` - 지역, 전입일 검증
  - `validateStep2(profile)` - 가구원수, 결혼여부, 미성년 자녀 검증
  - `validateStep3(profile)` - 자산, 자동차, 소득 검증
  - 기존 `validateProfile()` 유지 (전체 검증용)

### Step 3: 스텝 인디케이터 컴포넌트 생성
- [x] `apps/web/src/components/StepIndicator.tsx` 생성
  - 현재 스텝 / 전체 스텝 수 표시
  - 완료/현재/미완료 스텝 시각적 구분
  - data-testid 속성 포함

### Step 4: Step1 컴포넌트 생성 (지역 정보)
- [x] `apps/web/src/components/steps/Step1Region.tsx` 생성
  - 살고있는 지역 (select)
  - 해당지역 마지막 전입일 (date)
  - 기존 OnboardingForm의 해당 필드 UI/로직 이동

### Step 5: Step2 컴포넌트 생성 (가구 정보)
- [x] `apps/web/src/components/steps/Step2Household.tsx` 생성
  - 가구원수 (number)
  - 결혼여부 (radio) + 혼인신고일 (조건부)
  - 미성년 자녀수 (number) + 자녀 상세정보 (동적 폼)

### Step 6: Step3 컴포넌트 생성 (자산/소득 정보)
- [x] `apps/web/src/components/steps/Step3Assets.tsx` 생성
  - 총자산 (number)
  - 자동차 보유여부 (radio) + 차량가액 (조건부)
  - 가구원 총 수입 (number)

### Step 7: 완료 요약 컴포넌트 생성
- [x] `apps/web/src/components/steps/StepComplete.tsx` 생성
  - 전체 입력 데이터를 가독성 있게 요약 표시
  - 완료 안내 메시지
  - "다시 입력하기" 버튼

### Step 8: OnboardingForm 리팩토링 (멀티스텝 컨테이너)
- [x] `apps/web/src/components/OnboardingForm.tsx` 수정
  - 스텝 상태 관리 (currentStep)
  - 이전 데이터 복원 확인 UI
  - 스텝별 컴포넌트 렌더링
  - 이전/다음 버튼 + 로컬스토리지 저장 연동
  - StepIndicator 통합

### Step 9: 빌드 검증
- [x] TypeScript 컴파일 확인
- [x] Vite 빌드 성공 확인

### Step 10: 코드 요약 문서 생성
- [x] `aidlc-docs/construction/multi-step-form/code/code-summary.md` 생성
  - 생성/수정된 파일 목록
  - 주요 변경 사항 요약
