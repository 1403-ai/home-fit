# 요구사항 명세서 - Question Info (내 정보 표시 및 숫자 입력 개선)

## Intent Analysis

- **사용자 요청**: Q&A 질문 페이지(/announcements/:seq/questions)에 내 프로필 정보를 사이드 패널로 표시하고, 숫자 입력에 comma 포맷 적용
- **요청 유형**: Enhancement (기존 기능 개선)
- **범위**: Single Component (QuestionsPage) + 프로젝트 전체 숫자 입력 필드
- **복잡도**: Moderate (UI 레이아웃 변경 + 전역 숫자 포맷 유틸리티)

---

## 기능 요구사항

### FR-1: 내 정보 사이드 패널

**설명**: Q&A 질문 페이지에서 사용자가 이미 입력한 프로필 정보를 사이드 패널로 표시하여, 질문에 답변할 때 참고할 수 있도록 한다.

**상세 요구사항**:
- 데스크톱: 질문 카드 오른쪽에 사이드 패널로 표시
- 모바일: 접히는(collapsible) 토글 형태로 표시
- 표시 항목: UserProfile의 모든 필드 (가구원 수, 월 평균 소득, 총 자산, 거주 지역, 혼인 상태, 미성년 자녀 수, 청약통장 납입 횟수, 자동차 보유 여부, 차량가액)
- 토글 기본 상태: 접힌 상태 (사용자가 열어서 확인)
- 현재 질문과 관련된 프로필 항목은 하이라이트 표시

### FR-2: 프로필 미입력 시 입력 유도

**설명**: 프로필이 아직 입력되지 않은 경우, 사이드 패널 영역에 온보딩 페이지로 이동하는 안내를 표시한다.

**상세 요구사항**:
- 프로필이 없을 때: "내 정보를 입력하면 질문이 줄어듭니다" 안내 메시지 표시
- 온보딩 페이지(/onboarding)로 이동하는 버튼/링크 제공
- 프로필 입력 후 돌아오면 자동으로 사이드 패널에 정보 표시

### FR-3: 숫자 입력 Comma 포맷

**설명**: 프로젝트 전체의 모든 숫자 입력 필드에 천 단위 콤마를 적용하여 입력 편의성을 높인다.

**상세 요구사항**:
- 적용 범위: 프로젝트 전체 숫자 입력 필드 (QuestionsPage, OnboardingPage, MyProfilePage)
- 입력 시 실시간으로 comma 포맷 적용 (예: 1000 → 1,000)
- 내부 값은 숫자(number)로 유지, 표시만 comma 포맷
- 포커스 시에도 comma 유지
- 백스페이스/삭제 시 자연스러운 동작 보장

---

## 비기능 요구사항

### NFR-1: 반응형 레이아웃
- 데스크톱(768px 이상): 2컬럼 레이아웃 (질문 카드 + 사이드 패널)
- 모바일(768px 미만): 단일 컬럼, 사이드 패널은 토글로 접힘

### NFR-2: 성능
- 사이드 패널 토글 시 애니메이션 부드럽게 (CSS transition)
- 숫자 포맷 변환은 입력 지연 없이 즉시 반영

### NFR-3: 접근성
- 토글 버튼에 적절한 aria-expanded 속성
- 사이드 패널에 aria-label 제공
- 숫자 입력 필드의 실제 값은 aria-valuenow로 전달

---

## Extension Configuration

| Extension | Enabled | Decided At |
|---|---|---|
| Security Baseline | No (Skipped) | Requirements Analysis |
| Property-Based Testing | No (Skipped) | Requirements Analysis |
