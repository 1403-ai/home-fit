import { useNavigate } from 'react-router-dom';
import { type UserProfile } from '../../types/profile';

interface StepCompleteProps {
  profile: UserProfile;
}

const MARRIAGE_STATUS_LABEL: Record<string, string> = {
  single: '미혼',
  married: '기혼',
  engaged: '결혼예정',
};

export function StepComplete({ profile }: StepCompleteProps) {
  const navigate = useNavigate();

  return (
    <div className="space-y-6" data-testid="step-complete">
      <div className="bg-lime-50 border border-lime-200 rounded-lg p-4 text-center">
        <h2 className="text-lg font-semibold text-lime-800">✅ 프로필 입력이 완료되었습니다!</h2>
        <p className="mt-1 text-sm text-lime-600">
          아래에서 입력하신 내용을 확인해 주세요.
        </p>
      </div>

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
      <div className="pt-4 border-t">
        <button
          type="button"
          onClick={() => navigate('/')}
          className="w-full px-6 py-3 bg-orange-600 text-white font-medium rounded-lg hover:bg-orange-700 transition-colors"
          data-testid="step-complete-home-button"
        >
          홈으로
        </button>
      </div>
    </div>
  );
}
