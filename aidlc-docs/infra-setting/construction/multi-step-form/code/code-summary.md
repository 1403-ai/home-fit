# Code Summary: 멀티스텝 온보딩 폼 + 로컬스토리지

## 생성된 파일

| 파일 | 설명 |
|------|------|
| `apps/web/src/utils/storage.ts` | 로컬스토리지 유틸리티 (저장/불러오기/삭제) |
| `apps/web/src/components/StepIndicator.tsx` | 스텝 진행 인디케이터 컴포넌트 |
| `apps/web/src/components/steps/Step1Region.tsx` | Step 1 - 지역 정보 폼 |
| `apps/web/src/components/steps/Step2Household.tsx` | Step 2 - 가구 정보 폼 |
| `apps/web/src/components/steps/Step3Assets.tsx` | Step 3 - 자산/소득 정보 폼 |
| `apps/web/src/components/steps/StepComplete.tsx` | 완료 요약 화면 |

## 수정된 파일

| 파일 | 변경 내용 |
|------|-----------|
| `apps/web/src/components/OnboardingForm.tsx` | 단일 폼 → 멀티스텝 컨테이너로 리팩토링 |
| `apps/web/src/utils/validation.ts` | 스텝별 검증 함수 분리 (validateStep1/2/3) |

## 주요 변경 사항

### 멀티스텝 구조
- Step 1: 지역 + 전입일
- Step 2: 가구원수 + 결혼여부 + 미성년 자녀
- Step 3: 총자산 + 자동차 + 소득

### 로컬스토리지 연동
- 저장 키: `home-fit-onboarding-profile`
- "다음" 클릭 시 현재 프로필 전체를 localStorage에 저장
- 페이지 진입 시 이전 데이터 존재 확인 → 사용자에게 복원 여부 확인

### 스텝 인디케이터
- 상단에 3단계 진행 상태 시각적 표시
- 완료(✓)/현재(강조)/미완료 구분

### 유효성 검증
- 각 스텝별 해당 필드만 검증
- 검증 실패 시 다음 스텝 이동 불가
- 이전 스텝으로는 자유롭게 이동 가능

### 완료 화면
- 전체 입력 데이터를 섹션별로 가독성 있게 요약
- 완료 안내 메시지 표시

## 빌드 검증
- TypeScript: ✅ No errors
- Vite Build: ✅ Success (51 modules, 563ms)
