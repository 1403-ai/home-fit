import { type UserProfile, type FormErrors, REGIONS } from '../../types/profile';

interface Step1RegionProps {
  profile: UserProfile;
  errors: FormErrors;
  onChange: (field: keyof UserProfile, value: unknown) => void;
}

export function Step1Region({ profile, errors, onChange }: Step1RegionProps) {
  return (
    <div className="space-y-6" data-testid="step1-region">
      <h2 className="text-lg font-semibold text-gray-800">지역 정보</h2>
      <p className="text-sm text-gray-500">거주 지역과 전입일 정보를 입력해 주세요.</p>

      {/* 살고있는 지역 */}
      <div>
        <label htmlFor="region" className="block text-sm font-medium text-gray-700">
          살고있는 지역 <span className="text-red-500">*</span>
        </label>
        <select
          id="region"
          value={profile.region}
          onChange={(e) => onChange('region', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          data-testid="step1-region-select"
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

      {/* 해당지역 마지막 전입일 */}
      <div>
        <label htmlFor="lastMoveInDate" className="block text-sm font-medium text-gray-700">
          해당지역 마지막 전입일 <span className="text-red-500">*</span>
        </label>
        <input
          id="lastMoveInDate"
          type="date"
          value={profile.lastMoveInDate}
          onChange={(e) => onChange('lastMoveInDate', e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border px-3 py-2"
          data-testid="step1-last-move-in-date"
        />
        {errors.lastMoveInDate && (
          <p className="mt-1 text-sm text-red-600">{errors.lastMoveInDate}</p>
        )}
      </div>
    </div>
  );
}
