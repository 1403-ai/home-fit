export type SupplyCategory = '임대' | '분양';

export type AnnouncementStatus = '진행중' | '예정';

export type StatusFilter = '전체' | '진행중' | '예정';

export interface AnnouncementSummary {
  seq: string;
  title: string;
  housing_type: string;
  supply_category: SupplyCategory;
  status: AnnouncementStatus;
  application_start: string | null;
  application_end: string | null;
  unit_count: number;
}
