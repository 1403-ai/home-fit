export type SupplyCategory = '임대' | '분양' | '기타';

export type AnnouncementStatus = '진행중' | '예정';

export type StatusFilter = '전체' | '진행중' | '예정';

export interface AnnouncementSummary {
  _id: string;
  seq: string;
  title: string;
  housing_type: string | null;
  supply_category: SupplyCategory | null;
  status: AnnouncementStatus;
  application_start: string | null;
  application_end: string | null;
  unit_count: number | null;
  source_url: string | null;
  updated_at: string;
}
