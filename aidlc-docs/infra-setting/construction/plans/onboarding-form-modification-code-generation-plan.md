# Code Generation Plan: 입력폼 수정 및 Validation 강화

## Unit Context
- **Unit Name**: onboarding-form-modification
- **Project Type**: Brownfield (기존 멀티스텝 온보딩 폼 수정)
- **Workspace Root**: /Users/hongjae_eum/Desktop/projects/home-fit
- **Code Location**: apps/web/src/

## Dependencies
- React Router (기존 설치됨)
- LocalStorage utils (기존 구현됨)

## Step Sequence

### Step 1: 타입 정의 수정 (types/profile.ts)
- [x] `isMarried: boolean` → `marriageStatus: 'single' | 'married' | 'engaged'` 변경
- [x] `MarriageStatus` 타입 추가
- [x] `UserProfile` 인터페이스 업데이트

### Step 2: 스토리지 마이그레이션 로직 (utils/storage.ts)
- [x] `loadProfileFromStorage`에 마이그레이션 로직 추가
- [x] 기존 `isMarried: boolean` 데이터를 `marriageStatus`로 변환

### Step 3: Validation 로직 수정 (utils/validation.ts)
- [x] `validateStep2` 수정: 가구원수 최소값 validation 추가
- [x] 최소값 계산: 1(본인) + (married/engaged ? 1 : 0) + minorChildrenCount
- [x] 결혼상태에 따른 혼인신고일 validation 수정 (married만 필수)

### Step 4: OnboardingForm 컴포넌트 수정 (components/OnboardingForm.tsx)
- [x] `initialProfile`에서 `isMarried` → `marriageStatus: 'single'` 변경
- [x] `handleMarriedChange` → `handleMarriageStatusChange` 변경
- [x] 관련 핸들러 로직 수정

### Step 5: Step2Household 컴포넌트 수정 (components/steps/Step2Household.tsx)
- [x] 결혼여부 라디오 버튼을 3가지 선택지로 변경 (미혼/기혼/결혼예정)
- [x] 혼인신고일 조건부 렌더링 수정 (married일 때만 표시)
- [x] Props 인터페이스 업데이트

### Step 6: StepComplete 컴포넌트 수정 (components/steps/StepComplete.tsx)
- [x] "다시 입력하기" 버튼 → "홈으로" 버튼 변경
- [x] `onReset` prop → `useNavigate`로 홈 이동
- [x] 결혼상태 표시 로직 수정 (미혼/기혼/결혼예정)

### Step 7: MyProfilePage 생성 (pages/MyProfilePage.tsx)
- [x] 로컬스토리지에서 프로필 데이터 로드
- [x] StepComplete와 동일한 레이아웃으로 정보 표시
- [x] 데이터 없을 경우 안내 메시지 + 온보딩 이동 버튼
- [x] "수정하기" 버튼 (온보딩 페이지로 이동)
- [x] "홈으로" 버튼

### Step 8: App.tsx 라우트 추가
- [x] `/my-profile` 라우트 추가

### Step 9: HomePage 수정 (pages/HomePage.tsx)
- [x] "내 정보 확인" 버튼/링크 추가 (`/my-profile`로 이동)

### Step 10: 빌드 검증
- [x] TypeScript 컴파일 확인
- [x] Vite 빌드 성공 확인

## Total Steps: 10
## Estimated Scope: 9개 파일 수정/생성
