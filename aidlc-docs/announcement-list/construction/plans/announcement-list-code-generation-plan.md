# Code Generation Plan — announcement-list

## Unit Context
- **Unit**: 공고 목록 (Announcement List) 페이지
- **Scope**: Frontend only (apps/web)
- **Dependencies**: None (mock data, no API dependency)
- **Stories**: Browse active announcements list (BT-3 from business overview)

## Requirements Reference
- Route: `/announcements`
- Layout: 세로 1열 리스트
- Filter: 전체/진행중/예정 탭
- Data: AnnouncementSummary mock (5~8건)
- Style: Plain CSS
- Testing: Property-based tests with fast-check

---

## Code Generation Steps

### Step 1: TypeScript Types
- [x] Create `apps/web/src/types/announcement.ts`

### Step 2: Mock Data
- [x] Create `apps/web/src/mocks/announcements.ts`

### Step 3: Filter Logic (Pure Function)
- [x] Create `apps/web/src/utils/filterAnnouncements.ts`

### Step 4: AnnouncementsPage Component
- [x] Create `apps/web/src/pages/AnnouncementsPage.tsx`

### Step 5: Page Styles
- [x] Create `apps/web/src/pages/AnnouncementsPage.css`

### Step 6: Route Registration
- [x] Modify `apps/web/src/App.tsx`

### Step 7: Navigation Link
- [x] Modify `apps/web/src/pages/HomePage.tsx`

### Step 8: Property-Based Tests (fast-check)
- [x] Add `vitest` and `fast-check` dev dependencies to `apps/web/package.json`
- [x] Create `apps/web/src/utils/filterAnnouncements.test.ts`

### Step 9: Documentation Summary
- [x] Create `aidlc-docs/construction/announcement-list/code/code-summary.md`
