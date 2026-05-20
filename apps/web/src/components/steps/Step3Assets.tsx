import { type UserProfile, type FormErrors } from '../../types/profile';
import { displayNumberValue, parseNumberInput } from '../../utils/number-input';

interface Step3AssetsProps {
  profile: UserProfile;
  errors: FormErrors;
  onChange: (field: keyof UserProfile, value: unknown) => void;
  onCarChange: (value: boolean) => void;
}

export function Step3Assets({ profile, errors, onChange, onCarChange }: Step3AssetsProps) {
  return (
    <div className="space-y-6" data-testid="step3-assets">
      <h2 className="text-lg font-semibold text-gray-800">자산 / 소득 정보</h2>
      <p className="text-sm text-gray-500">자산 및 소득 관련 정보를 입력해 주세요.</p>

      {/* 가구원 총 자산 */}
      <div>
        <label htmlFor="totalAssets" className="block text-sm font-medium text-gray-700">
          가구원 총 자산 (원) <span className="text-red-500">*</span>
        </label>
        <input
          id="totalAssets"
          type="number"
          min={0}
          value={displayNumberValue(profile.totalAssets)}
          onChange={(e) => onChange('totalAssets', parseNumberInput(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 border px-3 py-2"
          data-testid="step3-total-assets"
        />
        <p className="mt-1 text-xs text-gray-500">
          부동산 + 자동차 + 금융자산 + 일반자산 합계에서 부채를 차감한 금액 (원)
        </p>
        <div className="mt-1 p-2 bg-amber-50 rounded text-xs text-amber-700">
          ⚠️ 총자산에는 <strong>자동차 차량가액이 포함</strong>됩니다. 부동산, 자동차, 금융자산, 일반자산을 합산한 금액에서 부채를 차감하여 산출합니다.
        </div>
        {errors.totalAssets && (
          <p className="mt-1 text-sm text-red-600">{errors.totalAssets}</p>
        )}
      </div>

      {/* 자동차 보유 여부 */}
      <div>
        <span className="block text-sm font-medium text-gray-700">
          자동차 보유 여부 <span className="text-red-500">*</span>
        </span>
        <div className="mt-2 flex gap-4">
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasCar"
              checked={profile.hasCar === true}
              onChange={() => onCarChange(true)}
              className="text-amber-600 focus:ring-amber-500"
              data-testid="step3-has-car-yes"
            />
            <span className="ml-2 text-sm text-gray-700">예</span>
          </label>
          <label className="inline-flex items-center">
            <input
              type="radio"
              name="hasCar"
              checked={profile.hasCar === false}
              onChange={() => onCarChange(false)}
              className="text-amber-600 focus:ring-amber-500"
              data-testid="step3-has-car-no"
            />
            <span className="ml-2 text-sm text-gray-700">아니오</span>
          </label>
        </div>
      </div>

      {/* 자동차 차량가액 (조건부) */}
      {profile.hasCar && (
        <div>
          <label htmlFor="carValue" className="block text-sm font-medium text-gray-700">
            자동차 차량가액 (원) <span className="text-red-500">*</span>
          </label>
          <input
            id="carValue"
            type="number"
            min={0}
            value={displayNumberValue(profile.carValue)}
            onChange={(e) => onChange('carValue', parseNumberInput(e.target.value))}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 border px-3 py-2"
            data-testid="step3-car-value"
          />
          <div className="mt-1 p-2 bg-amber-50 rounded text-xs text-amber-800">
            💡 차량가액 조회 방법: <strong>보험개발원 차량기준가액</strong>으로 산정됩니다.
            홈택스 또는 지방세정 시가표준액에서도 확인 가능합니다.
            2대 이상 보유 시 합산하지 않고 개별 차량가액 중 높은 가액을 입력해 주세요.
          </div>
          {errors.carValue && (
            <p className="mt-1 text-sm text-red-600">{errors.carValue}</p>
          )}
        </div>
      )}

      {/* 가구원 총 수입 (소득정보) */}
      <div>
        <label htmlFor="totalIncome" className="block text-sm font-medium text-gray-700">
          가구원 총 수입 (원) <span className="text-red-500">*</span>
        </label>
        <input
          id="totalIncome"
          type="number"
          min={0}
          value={displayNumberValue(profile.totalIncome)}
          onChange={(e) => onChange('totalIncome', parseNumberInput(e.target.value))}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-amber-500 focus:ring-amber-500 border px-3 py-2"
          data-testid="step3-total-income"
        />
        <p className="mt-1 text-xs text-gray-500">
          세대 전체 월 평균 소득 (원)
        </p>
        <div className="mt-1 p-2 bg-amber-50 rounded text-xs text-amber-800">
          💡 소득 조회 방법: 건강보험공단의 <strong>보수월액</strong> 또는 <strong>국세청 종합소득</strong>에서 확인할 수 있습니다.
          근로소득, 사업소득, 재산소득, 기타소득(공적이전소득)을 모두 포함합니다.
        </div>
        {errors.totalIncome && (
          <p className="mt-1 text-sm text-red-600">{errors.totalIncome}</p>
        )}
      </div>
    </div>
  );
}
