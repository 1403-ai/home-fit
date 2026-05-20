# Code Summary — Announcement List Page

## Created Files

| File | Purpose |
|------|---------|
| `apps/web/src/types/announcement.ts` | TypeScript types (AnnouncementSummary, StatusFilter, etc.) |
| `apps/web/src/mocks/announcements.ts` | 7 mock announcement entries |
| `apps/web/src/utils/filterAnnouncements.ts` | Pure filter function (filterByStatus) |
| `apps/web/src/pages/AnnouncementsPage.tsx` | Page component with filter tabs + list |
| `apps/web/src/pages/AnnouncementsPage.css` | Plain CSS styles |
| `apps/web/src/utils/filterAnnouncements.test.ts` | PBT + example-based tests |

## Modified Files

| File | Change |
|------|--------|
| `apps/web/src/App.tsx` | Added `/announcements` route |
| `apps/web/src/pages/HomePage.tsx` | Added navigation link to announcements |
| `apps/web/package.json` | Added vitest, fast-check devDependencies + test scripts |
| `apps/web/vite.config.ts` | Added vitest test configuration |

## Component Structure

```
AnnouncementsPage
├── Filter Tabs (전체 / 진행중 / 예정)
└── Announcement List
    └── Announcement Item (×N)
        ├── Title + Status Badge
        └── Meta (housing_type, supply_category, dates, unit_count)
```

## Testing Approach

- **Framework**: Vitest + fast-check
- **PBT Rules Covered**:
  - PBT-03: Invariant (subset, status match, partition, size preservation)
  - PBT-04: Idempotence (double-filter = single-filter)
  - PBT-07: Domain-specific AnnouncementSummary generator
  - PBT-08: Fixed seed (42) for reproducibility
  - PBT-10: Example-based tests complement PBT
