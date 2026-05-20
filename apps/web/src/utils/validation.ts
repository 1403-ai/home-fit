import { type UserProfile, type FormErrors } from '../types/profile';

export function validateProfile(profile: UserProfile): FormErrors {
  const errors: FormErrors = {};

  // 가구원 수
  if (!profile.householdSize || profile.householdSize < 1) {
    errors.householdSize = '가구원 수는 1명 이상이어야 합니다.';
  }

  // 가구원 총 수입
  if (profile.totalIncome < 0) {
    errors.totalIncome = '총 수입은 0 이상이어야 합니다.';
  }

  // 결혼기념일 (결혼한 경우 필수)
  if (profile.isMarried && !profile.weddingAnniversary) {
    errors.weddingAnniversary = '결혼기념일을 입력해 주세요.';
  }

  if (profile.isMarried && profile.weddingAnniversary) {
    if (!isValidDate(profile.weddingAnniversary)) {
      errors.weddingAnniversary = '유효한 날짜를 입력해 주세요.';
    }
  }

  // 지역
  if (!profile.region) {
    errors.region = '지역을 선택해 주세요.';
  }

  // 마지막 전입일
  if (!profile.lastMoveInDate) {
    errors.lastMoveInDate = '마지막 전입일을 입력해 주세요.';
  } else if (!isValidDate(profile.lastMoveInDate)) {
    errors.lastMoveInDate = '유효한 날짜를 입력해 주세요.';
  }

  // 청약통장 납입 횟수
  if (profile.housingSubscriptionCount < 0) {
    errors.housingSubscriptionCount = '납입 횟수는 0 이상이어야 합니다.';
  }

  // 미성년 자녀 생년월일
  if (profile.minorChildrenBirthDates.length > 0) {
    const childErrors: string[] = profile.minorChildrenBirthDates.map((date) => {
      if (!date) return '생년월일을 입력해 주세요.';
      if (!isValidDate(date)) return '유효한 날짜를 입력해 주세요.';
      return '';
    });

    if (childErrors.some(Boolean)) {
      errors.minorChildrenBirthDates = childErrors;
    }
  }

  // 가구원 총 자산
  if (profile.totalAssets < 0) {
    errors.totalAssets = '총 자산은 0 이상이어야 합니다.';
  }

  return errors;
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
