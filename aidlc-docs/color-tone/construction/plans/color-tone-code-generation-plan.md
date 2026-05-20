# Code Generation Plan - 컬러톤 변경

## Unit Context
- **Unit Name**: color-tone
- **Scope**: 전체 프로덕트 UI 컬러 시스템을 오렌지/앰버 기반 따뜻한 톤으로 통일
- **Dependencies**: 없음 (순수 스타일링 변경)
- **Workspace Root**: /Users/hongjae_eum/Desktop/projects/home-fit

## Color Mapping Reference

| 영역 | Before | After |
|------|--------|-------|
| 온보딩 Primary | `blue-600` (#2563eb) | `amber-600` (#d97706) |
| 온보딩 Hover | `blue-700` (#1d4ed8) | `amber-700` (#b45309) |
| 온보딩 Light | `blue-100` (#dbeafe) | `amber-100` (#fef3c7) |
| 온보딩 Text | `text-blue-600` | `text-amber-600` |
| 공고/Q&A Primary | `#12615f` | `#b45309` (amber-700) |
| 공고/Q&A Hover | `#0e4e4c` | `#92400e` (amber-800) |
| 공고/Q&A Light BG | `#e8f5f3` / `#f0faf9` | `#fffbeb` (amber-50) |
| 공고/Q&A Light Text | `#12615f` | `#92400e` (amber-800) |
| 성공 상태 BG | `green-50` | `lime-50` |
| 성공 상태 Border | `green-200` | `lime-200` |
| 성공 상태 Text Dark | `green-800` | `lime-800` |
| 성공 상태 Text Light | `green-600` | `lime-600` |
| Feature 카드 1 | `blue-50`/`blue-600` | `orange-50`/`orange-600` |
| Feature 카드 2 | `green-50`/`green-600` | `amber-50`/`amber-600` |

## Generation Steps

### Step 1: StepIndicator.tsx 컬러 변경
- [x] `apps/web/src/components/StepIndicator.tsx`
- 변경: `blue-600` → `amber-600`, `blue-100` → `amber-100`, `text-blue-600` → `text-amber-600`

### Step 2: OnboardingForm.tsx 컬러 변경
- [x] `apps/web/src/components/OnboardingForm.tsx`
- 변경: `bg-blue-600` → `bg-amber-600`, `hover:bg-blue-700` → `hover:bg-amber-700`

### Step 3: StepComplete.tsx 컬러 변경
- [x] `apps/web/src/components/steps/StepComplete.tsx`
- 변경: `green-50/200/600/800` → `lime-50/200/600/800`, `bg-blue-600` → `bg-orange-600`, `hover:bg-blue-700` → `hover:bg-orange-700`

### Step 4: HomePage.tsx Feature 카드 컬러 변경
- [x] `apps/web/src/pages/HomePage.tsx`
- 변경: Feature 1 아이콘 `blue-50`/`blue-600` → `orange-50`/`orange-600`, Feature 2 아이콘 `green-50`/`green-600` → `amber-50`/`amber-600`

### Step 5: AnnouncementsPage.css 컬러 변경
- [x] `apps/web/src/pages/AnnouncementsPage.css`
- 변경: `#12615f` → `#b45309`, `#e8f5f3` → `#fffbeb`, hover 색상 업데이트

### Step 6: QuestionsPage.css 컬러 변경
- [x] `apps/web/src/pages/QuestionsPage.css`
- 변경: `#12615f` → `#b45309`, `#0e4e4c` → `#92400e`, `#e8f5f3`/`#f0faf9` → `#fffbeb`/`#fef3c7`

### Step 7: Code Summary 문서 생성
- [x] `aidlc-docs/color-tone/construction/color-tone/code/code-summary.md`
- 변경된 파일 목록 및 컬러 매핑 요약 문서 생성
