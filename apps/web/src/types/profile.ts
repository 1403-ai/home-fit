export const REGIONS = [
  '서울특별시',
  '부산광역시',
  '대구광역시',
  '인천광역시',
  '광주광역시',
  '대전광역시',
  '울산광역시',
  '세종특별자치시',
  '경기도',
  '강원특별자치도',
  '충청북도',
  '충청남도',
  '전북특별자치도',
  '전라남도',
  '경상북도',
  '경상남도',
  '제주특별자치도',
] as const;

export type Region = (typeof REGIONS)[number];

export type MarriageStatus = 'single' | 'married' | 'engaged';

export interface MinorChild {
  isUnborn: boolean;
  birthDate?: string;
  expectedDate?: string;
}

export interface UserProfile {
  householdSize: number;
  totalIncome: number;
  marriageStatus: MarriageStatus;
  marriageRegistrationDate: string | null;
  region: Region | '';
  lastMoveInDate: string;
  housingSubscriptionCount: number;
  minorChildrenCount: number;
  minorChildren: MinorChild[];
  hasCar: boolean;
  carValue: number;
  totalAssets: number;
}

export interface FormErrors {
  householdSize?: string;
  totalIncome?: string;
  marriageStatus?: string;
  marriageRegistrationDate?: string;
  region?: string;
  lastMoveInDate?: string;
  housingSubscriptionCount?: string;
  minorChildrenCount?: string;
  minorChildren?: string[];
  hasCar?: string;
  carValue?: string;
  totalAssets?: string;
}
