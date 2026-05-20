# Home 페이지 요구사항 명세서

## Intent Analysis

| 항목 | 내용 |
|------|------|
| **사용자 요청** | 청약/임대주택을 쉽게 찾을 수 있다는 설명을 유저에게 알려주는 Intro Home 페이지 제작 + GNB 구현 |
| **요청 유형** | Enhancement (기존 HomePage 개선) |
| **범위** | Multiple Components — HomePage 교체, GNB 신규, App 레벨 레이아웃 변경, 라우팅 수정 |
| **복잡도** | Moderate — UI 중심이나 GNB 전역 적용 + 프로필 상태 연동 필요 |

---

## 기능 요구사항 (Functional Requirements)

### FR-1: Intro Home 페이지

| ID | 요구사항 |
|----|----------|
| FR-1.1 | `/` 경로에 새로운 Intro Home 페이지를 표시한다 |
| FR-1.2 | 서비스 소개 문구를 표시한다: home-fit이 SH 공공주택 청약/임대 공고를 AI로 분석하여 사용자의 자격과 비용을 쉽게 확인할 수 있다는 내용 |
| FR-1.3 | 따뜻하고 신뢰감 있는 톤앤매너로 디자인한다 (부드러운 색상 + 집/가족 관련 SVG 일러스트) |
| FR-1.4 | SVG 일러스트레이션을 코드로 직접 작성하여 포함한다 (외부 의존성 없음) |
| FR-1.5 | 비전문가도 이해할 수 있는 쉬운 용어로 서비스 가치를 설명한다 |
| FR-1.6 | 주요 기능 3가지를 간결하게 소개한다: (1) AI 공고 분석, (2) 간단한 Q&A로 자격 확인, (3) 비용 안내 |

### FR-2: GNB (Global Navigation Bar)

| ID | 요구사항 |
|----|----------|
| FR-2.1 | 모든 페이지 상단에 GNB를 공통으로 표시한다 (App 레벨 렌더링) |
| FR-2.2 | GNB에 서비스 로고/이름 "Home Fit"을 표시한다 |
| FR-2.3 | GNB에 "내 정보 입력하기" 링크를 표시한다 (프로필 미완성 시) |
| FR-2.4 | GNB에 "내 정보 보기" 링크를 표시한다 (프로필 완성 시) |
| FR-2.5 | 프로필 완성 판단 기준: 로컬 스토리지에 UserProfile이 존재하고, 필수 필드(district, household_size, no_house, monthly_income, asset_range)가 모두 채워져 있을 때 |
| FR-2.6 | GNB에 "공고 목록" 링크를 표시한다 (`/announcements`로 이동) |
| FR-2.7 | 현재 페이지에 해당하는 GNB 항목을 시각적으로 구분한다 (active state) |

### FR-3: 기존 Health Check 페이지 분리

| ID | 요구사항 |
|----|----------|
| FR-3.1 | 기존 Health Check UI를 `/status` 경로로 이동한다 |
| FR-3.2 | 기존 HomePage.tsx를 StatusPage.tsx로 리네이밍한다 |
| FR-3.3 | App.tsx 라우팅에 `/status` 경로를 추가한다 |

---

## 비기능 요구사항 (Non-Functional Requirements)

### NFR-1: 성능
- Home 페이지 초기 로딩 시 외부 API 호출 없음 (SVG는 인라인, 프로필은 로컬 스토리지)
- GNB 프로필 상태 확인은 로컬 스토리지 읽기만으로 처리 (네트워크 요청 없음)

### NFR-2: 접근성
- SVG 일러스트에 적절한 `aria-label` 또는 `role="img"` + `aria-labelledby` 제공
- GNB 네비게이션에 `<nav>` 시맨틱 태그 + `aria-label` 사용
- 키보드 네비게이션 지원 (Tab 순서, focus 스타일)

### NFR-3: 반응형
- 모바일(< 768px), 태블릿(768px~1024px), 데스크톱(> 1024px) 대응
- GNB는 모바일에서 햄버거 메뉴 또는 간소화된 형태로 표시

### NFR-4: 유지보수성
- GNB를 독립 컴포넌트로 분리 (`components/GNB.tsx`)
- 프로필 상태 확인 로직을 유틸리티 함수로 분리 (`utils/profile.ts`)
- SVG 일러스트를 별도 컴포넌트로 분리 (`components/illustrations/`)

---

## 기술 결정사항

| 항목 | 결정 |
|------|------|
| 프레임워크 | React 18 + TypeScript (기존 유지) |
| 스타일링 | TailwindCSS 4 (기존 유지) |
| 라우팅 | react-router-dom v7 (기존 유지) |
| 이미지 | SVG 인라인 코드 (JSX 컴포넌트) |
| 상태 관리 | 로컬 스토리지 직접 접근 (기존 패턴 유지) |
| 확장 규칙 | Security: Skip, PBT: Skip |

---

## 컴포넌트 구조 (예상)

```
apps/web/src/
├── components/
│   ├── GNB.tsx                    # 전역 네비게이션 바
│   └── illustrations/
│       └── HomeIllustration.tsx   # Home 페이지 SVG 일러스트
├── pages/
│   ├── HomePage.tsx               # 새 Intro Home (교체)
│   └── StatusPage.tsx             # 기존 Health Check (이동)
├── utils/
│   └── profile.ts                 # 프로필 완성 여부 확인 유틸
└── App.tsx                        # GNB 추가 + 라우팅 수정
```
