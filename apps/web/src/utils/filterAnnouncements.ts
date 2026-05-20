import type { AnnouncementSummary, StatusFilter } from '../types/announcement';

/**
 * Filters announcements by status.
 * - "전체" returns all items unchanged.
 * - "진행중" or "예정" returns only items matching that status.
 */
export function filterByStatus(
  items: AnnouncementSummary[],
  filter: StatusFilter,
): AnnouncementSummary[] {
  if (filter === '전체') {
    return items;
  }
  return items.filter((item) => item.status === filter);
}
