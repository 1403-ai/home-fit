# 컬러톤 변경 요구사항 명세서

## Intent Analysis

| 항목 | 내용 |
|------|------|
| **User Request** | 프로덕트 전체 컬러톤을 따뜻한 오렌지 기반으로 통일. 온보딩(파랑→앰버), 공고목록(초록→앰버) 변경 |
| **Request Type** | Enhancement (기존 기능 개선) |
| **Scope** | System-wide (전체 UI 컬러 시스템) |
| **Complexity** | Moderate (다수 파일 수정, 일관성 유지 필요) |

---

## 1. 컬러 팔레트 정의

### 1.1 메인 브랜드 컬러 (변경 없음)
- **Primary**: `orange-600` (#ea580c) — 홈페이지, GNB, CTA 버튼
- **Primary Hover**: `orange-700` (#c2410c)
- **Primary Light**: `orange-50` (#fff7ed) — 배경, 하이라이트

### 1.2 온보딩 페이지 컬러 (변경)
- **Before**: `blue-600` (#2563eb)
- **After**: `amber-600` (#d97706) — 따뜻한 앰버/골드 계열
- **After Hover**: `amber-700` (#b45309)
- **After Light**: `amber-50` (#fffbeb) — 배경
- **After Ring**: `amber-100` (#fef3c7) — 포커스 링

### 1.3 공고 목록/Q&A 페이지 컬러 (변경)
- **Before**: `#12615f` (dark teal/green)
- **After**: `amber-700` (#b45309) — 따뜻한 앰버/골드 계열
- **After Hover**: `amber-800` (#92400e)
- **After Light**: `amber-50` (#fffbeb) — 배경, 배지
- **After Text on Light**: `amber-800` (#92400e)

### 1.4 성공/완료 상태 컬러 (변경)
- **Before**: `green-50`/`green-800` (표준 그린)
- **After**: `lime-50`/`lime-800` — 따뜻한 톤의 yellow-green 계열
- **After Border**: `lime-200`
- **After Text**: `lime-600`

### 1.5 Feature 카드 아이콘 컬러 (조정)
- AI 공고 분석: `orange-50`/`orange-600` (blue → orange로 변경)
- 간단한 Q&A: `amber-50`/`amber-600` (green → amber로 변경)
- 비용 한눈에: `amber-50`/`amber-600` (유지)

---

## 2. 기능 요구사항

### FR-1: 온보딩 페이지 컬러 변경
- StepIndicator 컴포넌트: `blue-600` → `amber-600` (완료/현재 스텝)
- StepIndicator 링: `blue-100` → `amber-100`
- StepIndicator 텍스트: `text-blue-600` → `text-amber-600`
- OnboardingForm 버튼: `bg-blue-600` → `bg-amber-600`
- StepComplete "홈으로" 버튼: `bg-blue-600` → `bg-orange-600` (메인 CTA이므로 primary 사용)

### FR-2: 공고 목록 페이지 컬러 변경 (AnnouncementsPage.css)
- `.filter-tab:hover`, `.filter-tab.active`: `#12615f` → amber-700 계열
- `.status-badge.status-active`: `#e8f5f3`/`#12615f` → amber-50/amber-800 계열
- `.supply-badge.supply-rent`: blue 계열 유지 또는 orange 계열로 변경

### FR-3: Q&A 페이지 컬러 변경 (QuestionsPage.css)
- `.questions-progress-bar`: `#12615f` → amber-700 계열
- `.number-input:focus`: `#12615f` → amber-600 계열
- `.btn-answer:hover`: `#12615f`/`#f0faf9` → amber-600/amber-50 계열
- `.btn-submit`: `#12615f` → amber-700 계열
- `.btn-primary`: `#12615f` → amber-700 계열
- `.result-icon`: `#e8f5f3`/`#12615f` → amber-50/amber-700 계열
- `.questions-back-link`: `#12615f` → amber-700 계열

### FR-4: StepComplete 성공 상태 변경
- `bg-green-50` → `bg-lime-50`
- `border-green-200` → `border-lime-200`
- `text-green-800` → `text-lime-800`
- `text-green-600` → `text-lime-600`

### FR-5: HomePage Feature 카드 아이콘 변경
- Feature 1 (AI 공고 분석): `bg-blue-50`/`text-blue-600` → `bg-orange-50`/`text-orange-600`
- Feature 2 (간단한 Q&A): `bg-green-50`/`text-green-600` → `bg-amber-50`/`text-amber-600`

---

## 3. 비기능 요구사항

### NFR-1: 접근성
- 모든 컬러 변경 후 WCAG 2.1 AA 대비율(4.5:1) 충족 확인
- 특히 amber 계열은 밝은 배경에서 대비가 낮을 수 있으므로 주의

### NFR-2: 일관성
- 동일 기능(CTA, hover, active)에는 동일 컬러 적용
- 페이지 간 전환 시 시각적 이질감 최소화

### NFR-3: 유지보수성
- CSS 커스텀 속성 또는 Tailwind 설정으로 컬러 중앙 관리 고려 (선택사항)

---

## 4. 변경 범위 요약

| 파일 | 변경 내용 |
|------|-----------|
| `src/components/StepIndicator.tsx` | blue → amber |
| `src/components/OnboardingForm.tsx` | blue → amber |
| `src/components/steps/StepComplete.tsx` | green → lime, blue → orange |
| `src/pages/HomePage.tsx` | Feature 카드 아이콘 blue/green → orange/amber |
| `src/pages/AnnouncementsPage.css` | #12615f → amber 계열 |
| `src/pages/QuestionsPage.css` | #12615f → amber 계열 |

---

## 5. Extension Configuration

| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | No (Skipped) | Requirements Analysis |
| Property-Based Testing | No (Skipped) | Requirements Analysis |
