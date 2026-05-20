# Code Summary - 컬러톤 변경

## 변경된 파일 목록

| # | 파일 | 변경 유형 | 설명 |
|---|------|-----------|------|
| 1 | `apps/web/src/components/StepIndicator.tsx` | Modified | blue-600 → amber-600, blue-100 → amber-100 |
| 2 | `apps/web/src/components/OnboardingForm.tsx` | Modified | blue-600 → amber-600 (버튼 2개) |
| 3 | `apps/web/src/components/steps/StepComplete.tsx` | Modified | green → lime (성공 배너), blue → orange (홈 버튼) |
| 4 | `apps/web/src/pages/HomePage.tsx` | Modified | Feature 카드 아이콘 blue → orange, green → amber |
| 5 | `apps/web/src/pages/AnnouncementsPage.css` | Modified | #12615f → #b45309 (amber-700), 배경색 업데이트 |
| 6 | `apps/web/src/pages/QuestionsPage.css` | Modified | #12615f → #b45309, 전체 인터랙션 컬러 업데이트 |

## 컬러 매핑 결과

### 페이지별 최종 컬러

| 페이지 | Primary | Hover | Light BG | 역할 |
|--------|---------|-------|----------|------|
| 홈 | orange-600 | orange-700 | orange-50 | 브랜드 메인 |
| 온보딩 | amber-600 | amber-700 | amber-100 | 부드러운 골드 |
| 공고 목록 | #b45309 (amber-700) | #92400e (amber-800) | #fffbeb (amber-50) | 진한 앰버 |
| Q&A | #b45309 (amber-700) | #92400e (amber-800) | #fffbeb (amber-50) | 진한 앰버 |
| 완료 상태 | lime-800 | - | lime-50 | 따뜻한 그린 |

## 빌드 결과
- **TypeScript 컴파일**: ✅ 성공
- **Vite 빌드**: ✅ 성공 (64 modules, 662ms)
- **출력 크기**: CSS 32.89KB, JS 233.78KB
