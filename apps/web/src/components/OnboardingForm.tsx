import { useState } from 'react';
import { type UserProfile, type FormErrors, REGIONS } from '../types/profile';
import { validateProfile } from '../utils/validation';

const initialProfile: UserProfile = {
  householdSize: 1,
  totalIncome: 0,
  isMarried: false,
  weddingAnniversary: null,
  region: '',
  lastMoveInDate: '',
  housingSubscriptionCount: 0,
  minorChildrenBirthDates: [],
  totalAssets: 0,
};

export function OnboardingForm() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  function handleChange(field: keyof UserProfile, value: unknown) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleMarriedChange(value: boolean) {
    setProfile((prev) => ({
      ...prev,
      isMarried: value,
      weddingAnniversary: value ? prev.weddingAnniversary : null,
    }));
  }

  function addChild() {
    setProfile((prev) => ({
      ...prev,
      minorChildrenBirthDates: [...prev.minorChildrenBirthDates, ''],
    }));
  }

  function removeChild(index: number) {
    setProfile((prev) => ({
      ...prev,
      minorChildrenBirthDates: prev.minorChildrenBirthDates.filter((_, i) => i !== index),
    }));
  }

  function updateChildBirthDate(index: number, value: string) {
    setProfile((prev) => ({
      ...prev,
      minorChildrenBirthDates: prev.minorChildrenBirthDates.map((date, i) =>
        i === index ? value : date
      ),
    }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateProfile(profile);
    setErrors(validationErrors);

    const hasErrors =
      Object.values(validationErrors).some((v) =>
        Array.isArray(v) ? v.some(Boolean) : Boolean(v)
      );

    if (!hasErrors) {
      console.log('프로필 데이터:', profile);
      setSubmitted(true);
    }
  }

  if (submitted) {
    return (
      <div
        className="bg-green-50 border border-green-200 rounded-lg p-6 text-center"
        data-testid="onboarding-form-success"
      >
        <h2 className="text-lg font-semibold text-green-800">프로필이 저장되었습니다!</h2>
        <p className="mt-2 text-green-600">입력하신 정보가 콘솔에 출력되었습니다.</p>
        <button
          type="button"
          onClick={() => setSubmitted(false)}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          data-testid="onboarding-form-reset-button"
        >
          다시 입력하기
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white rounded-lg shadow p-6 space-y-6"
      data-testid="onboarding-form"
    >
      {/* 1. 가구원 수 */}
      <div>
        <label htmlFor="householdSize" className="block text-sm font-medium text-gray-700">
          가구원 수 <span className="text-red-500">*</span>
        </label>
        <input
          id="householdSize"
          type="number"
          min={1}
          value={profile.householdSize}
          onChange={(e) => handleChange('householdSize', Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          data-testid="onboarding-form-household-size"
        />
        <p className="mt-1 text-xs text-gray-500">본인 포함 세대원 수 (명)</p>
        {errors.householdSize && (
          <p className="mt-1 text-sm text-red-600">{errors.householdSize}</p>
        )}
      </div>

      {/* 2. 가구원 총 수입 */}
      <div>
        <label htmlFor="totalIncome" className="block text-sm font-medium text-gray-700">
          가구원 총 수입 (만원) <span className="text-red-500">*</span>
        </label>
        <input
          id="totalIncome"
          type="number"
          min={0}
          value={profile.totalIncome}
          onChange={(e) => handleChange('totalIncome', Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          data-testid="onboarding-form-total-income"
        />
        <p className="mt-1 text-xs text-gray-500">세대 전체 월 평균 소득 (만원)</p>
        {errors.totalIncome && (
          <p className="mt-1 text-sm text-red-600">{errors.totalIncome}</p>
        )}
      </div>

      {/* 3. 결혼 여부 */}
      <div>
        <span className="block text-sm font-medium text-gray-700">
          결혼 여부 <span className="text-red-500">*</span>
        </span>
        <div className="mt-2 flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="isMarried"
              checked={profile.isMarried === true}
              onChange={() => handleMarriedChange(true)}
              className="text-blue-600 focus:ring-blue-500"
              data-testid="onboarding-form-married-yes"
            />
            <span className="ml-2 text-sm text-gray-700">예</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="isMarried"
              checked={profile.isMarried === false}
              onChange={() => handleMarriedChange(false)}
              className="text-blue-600 focus:ring-blue-500"
              data-testid="onboarding-form-married-no"
            />
            <span className="ml-2 text-sm text-gray-700">아니오</span>
          </label>
        </div>
      </div>

      {/* 4. 결혼기념일 (조건부) */}
      {profile.isMarried && (
        <div>
          <label htmlFor="weddingAnniversary" className="block text-sm font-medium text-gray-700">
            결혼기념일 <span className="text-red-500">*</span>
          </label>
          <input
            id="weddingAnniversary"
            type="date"
            value={profile.weddingAnniversary ?? ''}
            onChange={(e) => handleChange('weddingAnniversary', e.target.value || null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
            data-testid="onboarding-form-wedding-anniversary"
          />
          {errors.weddingAnniversary && (
            <p className="mt-1 text-sm text-red-600">{errors.weddingAnniversary}</p>
          )}
        </div>
      )}

      {/* 5. 살고있는 지역 */}
      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
          살고있는 지역 <span className="text-red-500">*</span>
        </label>
        <select
          id="region"
          value={profile.region}
          onChange={(e) => handleChange('region', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          data-testid="onboarding-form-region"
        >
          <option value="">선택해 주세요</option>
          {REGIONS.map((region) => (
            <option key={region} value={region}>
              {region}
            </option>
          ))}
        </select>
        {errors.region && (
          <p className="mt-1 text-sm text-red-600">{errors.region}</p>
        )}
      </div>

      {/* 6. 해당지역 마지막 전입일 */}
      <div>
        <label htmlFor="lastMoveInDate" className="block text-sm font-medium text-gray-700">
          해당지역 마지막 전입일 <span className="text-red-500">*</span>
        </label>
        <input
          id="lastMoveInDate"
          type="date"
          value={profile.lastMoveInDate}
          onChange={(e) => handleChange('lastMoveInDate', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          data-testid="onboarding-form-last-move-in-date"
        />
        {errors.lastMoveInDate && (
          <p className="mt-1 text-sm text-red-600">{errors.lastMoveInDate}</p>
        )}
      </div>

      {/* 7. 청약통장 납입 횟수 */}
      <div>
        <label htmlFor="housingSubscriptionCount" className="block text-sm font-medium text-gray-700">
          청약통장 납입 횟수 <span className="text-red-500">*</span>
        </label>
        <input
          id="housingSubscriptionCount"
          type="number"
          min={0}
          value={profile.housingSubscriptionCount}
          onChange={(e) => handleChange('housingSubscriptionCount', Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          data-testid="onboarding-form-subscription-count"
        />
        <p className="mt-1 text-xs text-gray-500">입력날짜 기준 납입 횟수</p>
        {errors.housingSubscriptionCount && (
          <p className="mt-1 text-sm text-red-600">{errors.housingSubscriptionCount}</p>
        )}
      </div>

      {/* 8. 미성년 자녀 생년월일 */}
      <div>
        <span className="block text-sm font-medium text-gray-700">미성년 자녀 생년월일</span>
        <p className="mt-1 text-xs text-gray-500">미성년 자녀가 있는 경우 생년월일을 추가해 주세요.</p>
        <div className="mt-2 space-y-2">
          {profile.minorChildrenBirthDates.map((date, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="date"
                value={date}
                onChange={(e) => updateChildBirthDate(index, e.target.value)}
                className="flex-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
                data-testid={`onboarding-form-child-birthdate-${index}`}
              />
              <button
                type="button"
                onClick={() => removeChild(index)}
                className="px-3 py-2 text-sm text-red-600 border border-red-300 rounded-md hover:bg-red-50 transition-colors"
                data-testid={`onboarding-form-remove-child-${index}`}
              >
                삭제
              </button>
              {errors.minorChildrenBirthDates?.[index] && (
                <p className="text-sm text-red-600">{errors.minorChildrenBirthDates[index]}</p>
              )}
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={addChild}
          className="mt-2 px-4 py-2 text-sm text-blue-600 border border-blue-300 rounded-md hover:bg-blue-50 transition-colors"
          data-testid="onboarding-form-add-child-button"
        >
          + 자녀 추가
        </button>
      </div>

      {/* 9. 가구원 총 자산 */}
      <div>
        <label htmlFor="totalAssets" className="block text-sm font-medium text-gray-700">
          가구원 총 자산 (만원) <span className="text-red-500">*</span>
        </label>
        <input
          id="totalAssets"
          type="number"
          min={0}
          value={profile.totalAssets}
          onChange={(e) => handleChange('totalAssets', Number(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          data-testid="onboarding-form-total-assets"
        />
        <p className="mt-1 text-xs text-gray-500">부동산 + 금융자산 합계 (만원)</p>
        {errors.totalAssets && (
          <p className="mt-1 text-sm text-red-600">{errors.totalAssets}</p>
        )}
      </div>

      {/* Submit */}
      <div className="pt-4 border-t">
        <button
          type="submit"
          className="w-full px-6 py-3 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
          data-testid="onboarding-form-submit-button"
        >
          프로필 저장
        </button>
      </div>
    </form>
  );
}
