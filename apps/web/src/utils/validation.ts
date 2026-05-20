import { type UserProfile, type FormErrors } from '../types/profile';

export function validateStep1(profile: UserProfile): FormErrors {
  const errors: FormErrors = {};

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

  return errors;
}

export function validateStep2(profile: UserProfile): FormErrors {
  const errors: FormErrors = {};

  // 가구원수 최소값 계산
  const minHouseholdSize = calculateMinHouseholdSize(profile);

  if (!profile.householdSize || profile.householdSize < 1) {
    errors.householdSize = '가구원 수는 1명 이상이어야 합니다.';
  } else if (profile.householdSize < minHouseholdSize) {
    errors.householdSize = `가구원수는 최소 ${minHouseholdSize}명 이상이어야 합니다. (본인${profile.marriageStatus !== 'single' ? ' + 배우자' : ''}${profile.minorChildrenCount > 0 ? ` + 미성년 자녀 ${profile.minorChildrenCount}명` : ''})`;
  }

  // 혼인신고일 (기혼인 경우만 필수)
  if (profile.marriageStatus === 'married' && !profile.marriageRegistrationDate) {
    errors.marriageRegistrationDate = '혼인신고일을 입력해 주세요.';
  }

  if (profile.marriageStatus === 'married' && profile.marriageRegistrationDate) {
    if (!isValidDate(profile.marriageRegistrationDate)) {
      errors.marriageRegistrationDate = '유효한 날짜를 입력해 주세요.';
    }
  }

  // 미성년 자녀수
  if (profile.minorChildrenCount < 0) {
    errors.minorChildrenCount = '미성년 자녀수는 0 이상이어야 합니다.';
  }

  // 미성년 자녀 정보
  if (profile.minorChildren.length > 0) {
    const childErrors: string[] = profile.minorChildren.map((child) => {
      if (!child.isUnborn) {
        if (!child.birthDate) return '생년월일을 입력해 주세요.';
        if (!isValidDate(child.birthDate)) return '유효한 날짜를 입력해 주세요.';
      } else {
        if (child.expectedDate && !isValidDate(child.expectedDate)) {
          return '유효한 출산 예정일을 입력해 주세요.';
        }
      }
      return '';
    });

    if (childErrors.some(Boolean)) {
      errors.minorChildren = childErrors;
    }
  }

  return errors;
}

export function validateStep3(profile: UserProfile): FormErrors {
  const errors: FormErrors = {};

  // 가구원 총 자산
  if (profile.totalAssets < 0) {
    errors.totalAssets = '총 자산은 0 이상이어야 합니다.';
  }

  // 자동차 차량가액 (자동차 보유 시)
  if (profile.hasCar && profile.carValue < 0) {
    errors.carValue = '차량가액은 0 이상이어야 합니다.';
  }

  // 가구원 총 수입
  if (profile.totalIncome < 0) {
    errors.totalIncome = '총 수입은 0 이상이어야 합니다.';
  }

  return errors;
}

export function validateProfile(profile: UserProfile): FormErrors {
  return {
    ...validateStep1(profile),
    ...validateStep2(profile),
    ...validateStep3(profile),
  };
}

/**
 * 가구원수 최소값 계산
 * 본인(1) + 배우자(기혼/결혼예정 시 +1) + 미성년자녀수
 */
export function calculateMinHouseholdSize(profile: UserProfile): number {
  let min = 1; // 본인
  if (profile.marriageStatus === 'married' || profile.marriageStatus === 'engaged') {
    min += 1; // 배우자
  }
  min += profile.minorChildrenCount; // 미성년 자녀수
  return min;
}

function isValidDate(dateString: string): boolean {
  const date = new Date(dateString);
  return !isNaN(date.getTime());
}
