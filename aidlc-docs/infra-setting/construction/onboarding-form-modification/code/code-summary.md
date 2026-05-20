# Code Summary: 입력폼 수정 및 Validation 강화

## 변경 파일 목록

### Modified Files
| 파일 | 변경 내용 |
|------|-----------|
| `apps/web/src/types/profile.ts` | `isMarried` → `marriageStatus` 타입 변경, `MarriageStatus` 타입 추가 |
| `apps/web/src/utils/storage.ts` | 레거시 데이터 마이그레이션 로직 추가 |
| `apps/web/src/utils/validation.ts` | 가구원수 최소값 validation, 결혼상태 기반 validation 수정 |
| `apps/web/src/components/OnboardingForm.tsx` | `handleMarriageStatusChange` 핸들러, `StepComplete` props 변경 |
| `apps/web/src/components/steps/Step2Household.tsx` | 3가지 결혼상태 라디오 버튼, props 인터페이스 변경 |
| `apps/web/src/components/steps/StepComplete.tsx` | "홈으로" 버튼, `useNavigate` 사용, `onReset` prop 제거 |
| `apps/web/src/pages/HomePage.tsx` | "내 정보 확인" 버튼 추가 |
| `apps/web/src/App.tsx` | `/my-profile` 라우트 추가 |

### Created Files
| 파일 | 설명 |
|------|------|
| `apps/web/src/pages/MyProfilePage.tsx` | 내 프로필 페이지 (로컬스토리지 데이터 표시 + 수정 이동) |

## 주요 변경 사항

### 1. 결혼상태 타입 변경
- `isMarried: boolean` → `marriageStatus: MarriageStatus`
- `MarriageStatus = 'single' | 'married' | 'engaged'`

### 2. 가구원수 Validation
- `calculateMinHouseholdSize()` 함수 추가
- 최소값 = 1(본인) + (married/engaged ? 1 : 0) + minorChildrenCount
- 에러 메시지에 계산 근거 표시

### 3. 데이터 마이그레이션
- `migrateProfile()` 함수: 기존 `isMarried` boolean → `marriageStatus` 자동 변환

## Build Verification
- TypeScript: ✅ No errors
- Vite Build: ✅ Success (52 modules, 613ms)
