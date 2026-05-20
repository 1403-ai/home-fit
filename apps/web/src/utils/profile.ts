import { type UserProfile } from '../types/profile';
import { loadProfileFromStorage } from './storage';

/**
 * 프로필의 필수 필드가 모두 채워져 있는지 확인합니다.
 * GNB에서 "내 정보 입력하기" vs "내 정보 보기" 전환에 사용됩니다.
 */
export function isProfileComplete(profile: UserProfile | null): boolean {
  if (!profile) return false;

  const hasRegion = profile.region !== '' && profile.region != null;
  const hasHouseholdSize = profile.householdSize > 0;
  const hasTotalIncome = profile.totalIncome >= 0 && profile.totalIncome != null;
  const hasTotalAssets = profile.totalAssets >= 0 && profile.totalAssets != null;
  const hasMarriageStatus =
    profile.marriageStatus === 'single' ||
    profile.marriageStatus === 'married' ||
    profile.marriageStatus === 'engaged';

  return hasRegion && hasHouseholdSize && hasTotalIncome && hasTotalAssets && hasMarriageStatus;
}

/**
 * 로컬 스토리지에서 프로필을 로드하고 완성 여부를 반환합니다.
 */
export function checkProfileCompletion(): boolean {
  const profile = loadProfileFromStorage();
  return isProfileComplete(profile);
}
