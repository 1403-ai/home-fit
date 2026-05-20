import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { type UserProfile } from '../types/profile';
import { loadProfileFromStorage, hasStoredProfile } from '../utils/storage';

const MARRIAGE_STATUS_LABEL: Record<string, string> = {
  single: '미혼',
  married: '기혼',
  engaged: '결혼예정',
};

export function MyProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [hasData, setHasData] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (hasStoredProfile()) {
      const stored = loadProfileFromStorage();
      if (stored) {
        setProfile(stored);
        setHasData(true);
      }
    }
  }, []);

  // 데이터가 없는 경우
  if (!hasData || !profile) {
    return (
      <main className="min-h-screen bg-gray-50 py-10 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-lg shadow p-6" data-testid="my-profile-empty">
            <div className="text-center space-y-4">
              <div className="text-4xl">📝</div>
              <h2 className="text-lg font-semibold text-gray-800">
                아직 입력된 정보가 없습니다.
              </h2>
              <p className="text-sm text-gray-500">
                프로필 정보를 입력하면 이곳에서 확인할 수 있습니다.
              </p>
              <Link
                to="/onboarding"
                className="inline-block px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
                data-testid="my-profile-go-onboarding"
              >
                프로필 입력하기
              </Link>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">내 프로필</h1>
          <p className="mt-2 text-gray-600">
            입력하신 정보를 확인하고 수정할 수 있습니다.
          </p>
        </header>

        <div className="bg-white rounded-lg shadow p-6 space-y-6" data-testid="my-profile">
          {/* 지역 정보 */}
          <section className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">📍 지역 정보</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">살고있는 지역</dt>
                <dd className="text-sm font-medium text-gray-900">{profile.region || '-'}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">마지막 전입일</dt>
                <dd className="text-sm font-medium text-gray-900">{profile.lastMoveInDate || '-'}</dd>
              </div>
            </dl>
          </section>

          {/* 가구 정보 */}
          <section className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">👨‍👩‍👧‍👦 가구 정보</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">가구원 수</dt>
                <dd className="text-sm font-medium text-gray-900">{profile.householdSize}명</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">결혼 상태</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {MARRIAGE_STATUS_LABEL[profile.marriageStatus] ?? '-'}
                </dd>
              </div>
              {profile.marriageStatus === 'married' && profile.marriageRegistrationDate && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">혼인신고일</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {profile.marriageRegistrationDate}
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">미성년 자녀수</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {profile.minorChildrenCount}명
                </dd>
              </div>
              {profile.minorChildren.length > 0 && (
                <div className="mt-2">
                  <dt className="text-sm text-gray-500 mb-1">자녀 상세</dt>
                  <dd>
                    <ul className="space-y-1">
                      {profile.minorChildren.map((child, index) => (
                        <li key={index} className="text-sm text-gray-700 bg-gray-50 rounded px-2 py-1">
                          자녀 {index + 1}:{' '}
                          {child.isUnborn
                            ? `태아${child.expectedDate ? ` (예정일: ${child.expectedDate})` : ''}`
                            : `생년월일 ${child.birthDate}`}
                        </li>
                      ))}
                    </ul>
                  </dd>
                </div>
              )}
            </dl>
          </section>

          {/* 자산/소득 정보 */}
          <section className="border border-gray-200 rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 border-b pb-2">💰 자산 / 소득 정보</h3>
            <dl className="space-y-2">
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">가구원 총 자산</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {profile.totalAssets.toLocaleString()}원
                </dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">자동차 보유</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {profile.hasCar ? '예' : '아니오'}
                </dd>
              </div>
              {profile.hasCar && (
                <div className="flex justify-between">
                  <dt className="text-sm text-gray-500">차량가액</dt>
                  <dd className="text-sm font-medium text-gray-900">
                    {profile.carValue.toLocaleString()}원
                  </dd>
                </div>
              )}
              <div className="flex justify-between">
                <dt className="text-sm text-gray-500">가구원 총 수입 (월)</dt>
                <dd className="text-sm font-medium text-gray-900">
                  {profile.totalIncome.toLocaleString()}원
                </dd>
              </div>
            </dl>
          </section>

          {/* 액션 버튼 */}
          <div className="pt-4 border-t space-y-3">
            <button
              type="button"
              onClick={() => navigate('/onboarding')}
              className="w-full px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
              data-testid="my-profile-edit-button"
            >
              수정하기
            </button>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="w-full px-6 py-3 bg-gray-200 text-gray-700 font-medium rounded-lg hover:bg-gray-300 transition-colors"
              data-testid="my-profile-home-button"
            >
              홈으로
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
