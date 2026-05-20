import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { UserProfile } from '../types/profile';
import { loadProfileFromStorage, hasStoredProfile } from '../utils/storage';
import './MyInfoPanel.css';

const MARRIAGE_STATUS_LABEL: Record<string, string> = {
  single: '미혼',
  married: '기혼',
  engaged: '결혼예정',
};

interface MyInfoPanelProps {
  /** 현재 질문의 profile_key (하이라이트용) */
  currentProfileKey?: string;
}

interface ProfileItem {
  key: string;
  label: string;
  value: string;
}

function getProfileItems(profile: UserProfile): ProfileItem[] {
  const items: ProfileItem[] = [
    { key: 'region', label: '거주 지역', value: profile.region || '-' },
    { key: 'household_size', label: '가구원 수', value: `${profile.householdSize}명` },
    {
      key: 'marriage_status',
      label: '혼인 상태',
      value: MARRIAGE_STATUS_LABEL[profile.marriageStatus] ?? '-',
    },
    {
      key: 'monthly_income',
      label: '월 평균 소득',
      value: `${profile.totalIncome.toLocaleString('ko-KR')}원`,
    },
    {
      key: 'total_assets',
      label: '총 자산',
      value: `${profile.totalAssets.toLocaleString('ko-KR')}원`,
    },
    {
      key: 'minor_children_count',
      label: '미성년 자녀 수',
      value: `${profile.minorChildrenCount}명`,
    },
    {
      key: 'housing_subscription_count',
      label: '청약통장 납입 횟수',
      value: `${profile.housingSubscriptionCount}회`,
    },
    { key: 'has_car', label: '자동차 보유', value: profile.hasCar ? '예' : '아니오' },
  ];

  if (profile.hasCar) {
    items.push({
      key: 'car_value',
      label: '차량가액',
      value: `${profile.carValue.toLocaleString('ko-KR')}원`,
    });
  }

  return items;
}

export function MyInfoPanel({ currentProfileKey }: MyInfoPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasProfile = hasStoredProfile();
  const profile = hasProfile ? loadProfileFromStorage() : null;

  return (
    <aside className="my-info-panel" data-testid="my-info-panel">
      <button
        type="button"
        className="my-info-toggle"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-controls="my-info-content"
        data-testid="my-info-toggle"
      >
        <span className="my-info-toggle-icon">👤</span>
        <span className="my-info-toggle-text">내 정보</span>
        <span className={`my-info-toggle-arrow ${isOpen ? 'open' : ''}`}>
          ▾
        </span>
      </button>

      {isOpen && (
        <div
          id="my-info-content"
          className="my-info-content"
          aria-label="내 프로필 정보"
          data-testid="my-info-content"
        >
          {!hasProfile || !profile ? (
            <div className="my-info-empty" data-testid="my-info-empty">
              <p className="my-info-empty-text">
                내 정보를 입력하면 질문이 줄어듭니다
              </p>
              <Link
                to="/onboarding"
                className="my-info-onboarding-link"
                data-testid="my-info-go-onboarding"
              >
                프로필 입력하기 →
              </Link>
            </div>
          ) : (
            <ul className="my-info-list" data-testid="my-info-list">
              {getProfileItems(profile).map((item) => (
                <li
                  key={item.key}
                  className={`my-info-item ${
                    currentProfileKey === item.key ? 'my-info-item--highlight' : ''
                  }`}
                  data-testid={`my-info-item-${item.key}`}
                >
                  <span className="my-info-item-label">{item.label}</span>
                  <span className="my-info-item-value">{item.value}</span>
                </li>
              ))}
              <li className="my-info-edit">
                <Link
                  to="/onboarding"
                  className="my-info-edit-link"
                  data-testid="my-info-edit-link"
                >
                  수정하기
                </Link>
              </li>
            </ul>
          )}
        </div>
      )}
    </aside>
  );
}
