import type { UserProfile } from '../types/profile';
import type { Answer } from '../types/qa';

/**
 * Maps a QA state machine `profile_key` to the corresponding value
 * from the user's stored profile.
 *
 * Returns the profile value as an Answer (boolean | number | string),
 * or undefined if the profile_key is not recognized or the value is missing.
 */
export function getProfileAnswer(
  profileKey: string,
  profile: UserProfile,
): Answer | undefined {
  switch (profileKey) {
    case 'household_size':
      return profile.householdSize > 0 ? profile.householdSize : undefined;

    case 'monthly_income':
    case 'income':
      return profile.totalIncome >= 0 ? profile.totalIncome : undefined;

    case 'total_assets':
    case 'assets':
      return profile.totalAssets >= 0 ? profile.totalAssets : undefined;

    case 'region':
      return profile.region || undefined;

    case 'marriage_status':
      return profile.marriageStatus || undefined;

    case 'minor_children_count':
      return profile.minorChildrenCount >= 0
        ? profile.minorChildrenCount
        : undefined;

    case 'housing_subscription_count':
      return profile.housingSubscriptionCount >= 0
        ? profile.housingSubscriptionCount
        : undefined;

    case 'has_car':
      return profile.hasCar;

    case 'car_value':
      return profile.hasCar ? profile.carValue : undefined;

    default:
      return undefined;
  }
}

/**
 * Profile key to human-readable label mapping for the summary display.
 */
export function getProfileKeyLabel(profileKey: string): string {
  switch (profileKey) {
    case 'household_size':
      return '가구원 수';
    case 'monthly_income':
    case 'income':
      return '월 평균 소득';
    case 'total_assets':
    case 'assets':
      return '총 자산';
    case 'region':
      return '거주 지역';
    case 'marriage_status':
      return '혼인 상태';
    case 'minor_children_count':
      return '미성년 자녀 수';
    case 'housing_subscription_count':
      return '청약통장 납입 횟수';
    case 'has_car':
      return '자동차 보유';
    case 'car_value':
      return '차량가액';
    default:
      return profileKey;
  }
}

/**
 * Formats a profile answer for display in the skipped summary.
 */
export function formatProfileAnswer(
  profileKey: string,
  answer: Answer,
): string {
  if (typeof answer === 'boolean') {
    return answer ? '예' : '아니오';
  }
  if (typeof answer === 'number') {
    switch (profileKey) {
      case 'monthly_income':
      case 'income':
        return `${answer.toLocaleString('ko-KR')}만원`;
      case 'total_assets':
      case 'assets':
        return `${answer.toLocaleString('ko-KR')}만원`;
      case 'car_value':
        return `${answer.toLocaleString('ko-KR')}만원`;
      case 'household_size':
        return `${answer}명`;
      case 'minor_children_count':
        return `${answer}명`;
      case 'housing_subscription_count':
        return `${answer}회`;
      default:
        return String(answer);
    }
  }
  return String(answer);
}
