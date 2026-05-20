import { type UserProfile, type MarriageStatus, type MinorChild, type FormErrors } from '../../types/profile';
import { displayNumberValue, parseNumberInput } from '../../utils/number-input';

interface Step2HouseholdProps {
  profile: UserProfile;
  errors: FormErrors;
  onChange: (field: keyof UserProfile, value: unknown) => void;
  onMarriageStatusChange: (value: MarriageStatus) => void;
  onMinorChildrenCountChange: (count: number) => void;
  onChildUnbornToggle: (index: number, isUnborn: boolean) => void;
  onChildBirthDateChange: (index: number, value: string) => void;
  onChildExpectedDateChange: (index: number, value: string) => void;
}

export function Step2Household({
  profile,
  errors,
  onChange,
  onMarriageStatusChange,
  onMinorChildrenCountChange,
  onChildUnbornToggle,
  onChildBirthDateChange,
  onChildExpectedDateChange,
}: Step2HouseholdProps) {
  return (
    <div className="space-y-6" data-testid="step2-household">
      <h2 className="text-lg font-semibold text-gray-800">가구 정보</h2>
      <p className="text-sm text-gray-500">가구원 및 가족 관련 정보를 입력해 주세요.</p>

      {/* 가구원 수 */}
      <div>
        <label htmlFor="householdSize" className="block text-sm font-medium text-gray-700">
          가구원 수 <span className="text-red-500">*</span>
        </label>
        <input
          id="householdSize"
          type="number"
          min={1}
          value={displayNumberValue(profile.householdSize)}
          onChange={(e) => onChange('householdSize', parseNumberInput(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 border px-3 py-2"
          data-testid="step2-household-size"
        />
        <p className="mt-1 text-xs text-gray-500">
          본인 포함 무주택세대구성원 전원의 수 (태아 포함, 태아 수 확인 불가 시 1인으로 산정)
        </p>
        {errors.householdSize && (
          <p className="mt-1 text-sm text-red-600">{errors.householdSize}</p>
        )}
      </div>

      {/* 결혼 상태 */}
      <div>
        <span className="block text-sm font-medium text-gray-700">
          결혼 상태 <span className="text-red-500">*</span>
        </span>
        <div className="mt-2 flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="marriageStatus"
              checked={profile.marriageStatus === 'single'}
              onChange={() => onMarriageStatusChange('single')}
              className="text-amber-600 focus:ring-amber-500"
              data-testid="step2-marriage-single"
            />
            <span className="ml-2 text-sm text-gray-700">미혼</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="marriageStatus"
              checked={profile.marriageStatus === 'married'}
              onChange={() => onMarriageStatusChange('married')}
              className="text-amber-600 focus:ring-amber-500"
              data-testid="step2-marriage-married"
            />
            <span className="ml-2 text-sm text-gray-700">기혼</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="marriageStatus"
              checked={profile.marriageStatus === 'engaged'}
              onChange={() => onMarriageStatusChange('engaged')}
              className="text-amber-600 focus:ring-amber-500"
              data-testid="step2-marriage-engaged"
            />
            <span className="ml-2 text-sm text-gray-700">결혼예정</span>
          </label>
        </div>
        <p className="mt-1 text-xs text-gray-500">
          결혼예정인 경우 혼인신고일은 입력하지 않습니다.
        </p>
      </div>

      {/* 혼인신고일 (기혼인 경우만 표시) */}
      {profile.marriageStatus === 'married' && (
        <div>
          <label htmlFor="marriageRegistrationDate" className="block text-sm font-medium text-gray-700">
            혼인신고일 <span className="text-red-500">*</span>
          </label>
          <input
            id="marriageRegistrationDate"
            type="date"
            value={profile.marriageRegistrationDate ?? ''}
            onChange={(e) => onChange('marriageRegistrationDate', e.target.value || null)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 border px-3 py-2"
            data-testid="step2-marriage-registration-date"
          />
          <p className="mt-1 text-xs text-gray-500">
            혼인관계증명서에 기재된 혼인신고일을 입력해 주세요.
          </p>
          {errors.marriageRegistrationDate && (
            <p className="mt-1 text-sm text-red-600">{errors.marriageRegistrationDate}</p>
          )}
        </div>
      )}

      {/* 미성년 자녀수 */}
      <div>
        <label htmlFor="minorChildrenCount" className="block text-sm font-medium text-gray-700">
          미성년 자녀수 (태아 포함)
        </label>
        <input
          id="minorChildrenCount"
          type="number"
          min={0}
          value={displayNumberValue(profile.minorChildrenCount)}
          onChange={(e) => onMinorChildrenCountChange(parseNumberInput(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 border px-3 py-2"
          data-testid="step2-minor-children-count"
        />
        <p className="mt-1 text-xs text-gray-500">
          미성년 자녀 및 태아를 포함한 총 수를 입력해 주세요.
        </p>
        {errors.minorChildrenCount && (
          <p className="mt-1 text-sm text-red-600">{errors.minorChildrenCount}</p>
        )}
      </div>

      {/* 미성년 자녀 정보 */}
      {profile.minorChildren.length > 0 && (
        <div>
          <span className="block text-sm font-medium text-gray-700">미성년 자녀 정보</span>
          <p className="mt-1 text-xs text-gray-500">
            각 자녀의 태아 여부와 생년월일(또는 출산 예정일)을 입력해 주세요.
          </p>
          <div className="mt-2 space-y-4">
            {profile.minorChildren.map((child: MinorChild, index: number) => (
              <div
                key={index}
                className="p-3 border border-gray-200 rounded-md bg-gray-50"
                data-testid={`step2-child-${index}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-700">
                    자녀 {index + 1}
                  </span>
                  <label className="inline-flex items-center">
                    <input
                      type="checkbox"
                      checked={child.isUnborn}
                      onChange={(e) => onChildUnbornToggle(index, e.target.checked)}
                      className="rounded border-gray-300 text-amber-600 focus:ring-amber-500"
                      data-testid={`step2-child-${index}-unborn-toggle`}
                    />
                    <span className="ml-2 text-sm text-gray-600">태아</span>
                  </label>
                </div>

                {!child.isUnborn ? (
                  <div>
                    <label
                      htmlFor={`child-birthdate-${index}`}
                      className="block text-xs font-medium text-gray-600"
                    >
                      생년월일 <span className="text-red-500">*</span>
                    </label>
                    <input
                      id={`child-birthdate-${index}`}
                      type="date"
                      value={child.birthDate ?? ''}
                      onChange={(e) => onChildBirthDateChange(index, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 border px-3 py-2"
                      data-testid={`step2-child-${index}-birthdate`}
                    />
                  </div>
                ) : (
                  <div>
                    <label
                      htmlFor={`child-expected-date-${index}`}
                      className="block text-xs font-medium text-gray-600"
                    >
                      출산 예정일 (선택)
                    </label>
                    <input
                      id={`child-expected-date-${index}`}
                      type="date"
                      value={child.expectedDate ?? ''}
                      onChange={(e) => onChildExpectedDateChange(index, e.target.value)}
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 border px-3 py-2"
                      data-testid={`step2-child-${index}-expected-date`}
                    />
                    <p className="mt-1 text-xs text-gray-400">
                      태아의 출산 예정일을 알고 있다면 입력해 주세요.
                    </p>
                  </div>
                )}

                {errors.minorChildren?.[index] && (
                  <p className="mt-1 text-sm text-red-600">{errors.minorChildren[index]}</p>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
