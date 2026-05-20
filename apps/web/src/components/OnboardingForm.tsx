import { useState, useEffect } from 'react';
import { type UserProfile, type MarriageStatus, type MinorChild, type FormErrors } from '../types/profile';
import { validateStep1, validateStep2, validateStep3 } from '../utils/validation';
import { saveProfileToStorage, loadProfileFromStorage, hasStoredProfile } from '../utils/storage';
import { StepIndicator } from './StepIndicator';
import { Step1Region } from './steps/Step1Region';
import { Step2Household } from './steps/Step2Household';
import { Step3Assets } from './steps/Step3Assets';
import { StepComplete } from './steps/StepComplete';

const STEP_LABELS = ['지역 정보', '가구 정보', '자산/소득'];
const TOTAL_STEPS = 3;

const initialProfile: UserProfile = {
  householdSize: 1,
  totalIncome: 0,
  marriageStatus: 'single',
  marriageRegistrationDate: null,
  region: '',
  lastMoveInDate: '',
  housingSubscriptionCount: 0,
  minorChildrenCount: 0,
  minorChildren: [],
  hasCar: false,
  carValue: 0,
  totalAssets: 0,
};

export function OnboardingForm() {
  const [profile, setProfile] = useState<UserProfile>(initialProfile);
  const [errors, setErrors] = useState<FormErrors>({});
  const [currentStep, setCurrentStep] = useState(1);
  const [isComplete, setIsComplete] = useState(false);
  const [showRestorePrompt, setShowRestorePrompt] = useState(false);

  useEffect(() => {
    if (hasStoredProfile()) {
      setShowRestorePrompt(true);
    }
  }, []);

  function handleRestoreData(restore: boolean) {
    if (restore) {
      const stored = loadProfileFromStorage();
      if (stored) {
        setProfile(stored);
      }
    }
    setShowRestorePrompt(false);
  }

  function handleChange(field: keyof UserProfile, value: unknown) {
    setProfile((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  }

  function handleMarriageStatusChange(value: MarriageStatus) {
    setProfile((prev) => ({
      ...prev,
      marriageStatus: value,
      marriageRegistrationDate: value === 'married' ? prev.marriageRegistrationDate : null,
    }));
    if (errors.marriageStatus) {
      setErrors((prev) => ({ ...prev, marriageStatus: undefined }));
    }
    if (errors.marriageRegistrationDate) {
      setErrors((prev) => ({ ...prev, marriageRegistrationDate: undefined }));
    }
  }

  function handleCarChange(value: boolean) {
    setProfile((prev) => ({
      ...prev,
      hasCar: value,
      carValue: value ? prev.carValue : 0,
    }));
  }

  function handleMinorChildrenCountChange(count: number) {
    const newCount = Math.max(0, count);
    setProfile((prev) => {
      const currentChildren = [...prev.minorChildren];
      let updatedChildren: MinorChild[];

      if (newCount > currentChildren.length) {
        const additions = Array.from(
          { length: newCount - currentChildren.length },
          (): MinorChild => ({ isUnborn: false, birthDate: '' })
        );
        updatedChildren = [...currentChildren, ...additions];
      } else {
        updatedChildren = currentChildren.slice(0, newCount);
      }

      return {
        ...prev,
        minorChildrenCount: newCount,
        minorChildren: updatedChildren,
      };
    });
    if (errors.minorChildrenCount) {
      setErrors((prev) => ({ ...prev, minorChildrenCount: undefined }));
    }
    if (errors.minorChildren) {
      setErrors((prev) => ({ ...prev, minorChildren: undefined }));
    }
  }

  function handleChildUnbornToggle(index: number, isUnborn: boolean) {
    setProfile((prev) => ({
      ...prev,
      minorChildren: prev.minorChildren.map((child, i) =>
        i === index
          ? isUnborn
            ? { isUnborn: true, expectedDate: '' }
            : { isUnborn: false, birthDate: '' }
          : child
      ),
    }));
  }

  function handleChildBirthDateChange(index: number, value: string) {
    setProfile((prev) => ({
      ...prev,
      minorChildren: prev.minorChildren.map((child, i) =>
        i === index ? { ...child, birthDate: value } : child
      ),
    }));
  }

  function handleChildExpectedDateChange(index: number, value: string) {
    setProfile((prev) => ({
      ...prev,
      minorChildren: prev.minorChildren.map((child, i) =>
        i === index ? { ...child, expectedDate: value } : child
      ),
    }));
  }

  function validateCurrentStep(): boolean {
    let stepErrors: FormErrors = {};

    switch (currentStep) {
      case 1:
        stepErrors = validateStep1(profile);
        break;
      case 2:
        stepErrors = validateStep2(profile);
        break;
      case 3:
        stepErrors = validateStep3(profile);
        break;
    }

    setErrors(stepErrors);

    const hasErrors = Object.values(stepErrors).some((v) =>
      Array.isArray(v) ? v.some(Boolean) : Boolean(v)
    );

    return !hasErrors;
  }

  function handleNext() {
    if (!validateCurrentStep()) return;

    saveProfileToStorage(profile);

    if (currentStep < TOTAL_STEPS) {
      setCurrentStep((prev) => prev + 1);
      setErrors({});
    } else {
      // 마지막 스텝 완료
      saveProfileToStorage(profile);
      console.log('프로필 데이터:', JSON.stringify(profile, null, 2));
      setIsComplete(true);
    }
  }

  function handlePrev() {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
      setErrors({});
    }
  }

  // 이전 데이터 복원 확인 UI
  if (showRestorePrompt) {
    return (
      <div
        className="bg-white rounded-lg shadow p-6"
        data-testid="onboarding-form-restore-prompt"
      >
        <div className="text-center space-y-4">
          <div className="text-4xl">📋</div>
          <h2 className="text-lg font-semibold text-gray-800">
            이전에 작성 중이던 데이터가 있습니다.
          </h2>
          <p className="text-sm text-gray-500">
            이전 데이터를 불러와서 이어서 작성하시겠습니까?
          </p>
          <div className="flex gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={() => handleRestoreData(true)}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
              data-testid="onboarding-form-restore-yes"
            >
              예, 불러오기
            </button>
            <button
              type="button"
              onClick={() => handleRestoreData(false)}
              className="px-6 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              data-testid="onboarding-form-restore-no"
            >
              아니오, 새로 작성
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 완료 화면
  if (isComplete) {
    return (
      <div className="bg-white rounded-lg shadow p-6" data-testid="onboarding-form-complete">
        <StepComplete profile={profile} />
      </div>
    );
  }

  // 멀티스텝 폼
  return (
    <div className="bg-white rounded-lg shadow p-6" data-testid="onboarding-form">
      <StepIndicator
        currentStep={currentStep}
        totalSteps={TOTAL_STEPS}
        stepLabels={STEP_LABELS}
      />

      {/* 스텝별 컴포넌트 렌더링 */}
      {currentStep === 1 && (
        <Step1Region
          profile={profile}
          errors={errors}
          onChange={handleChange}
        />
      )}

      {currentStep === 2 && (
        <Step2Household
          profile={profile}
          errors={errors}
          onChange={handleChange}
          onMarriageStatusChange={handleMarriageStatusChange}
          onMinorChildrenCountChange={handleMinorChildrenCountChange}
          onChildUnbornToggle={handleChildUnbornToggle}
          onChildBirthDateChange={handleChildBirthDateChange}
          onChildExpectedDateChange={handleChildExpectedDateChange}
        />
      )}

      {currentStep === 3 && (
        <Step3Assets
          profile={profile}
          errors={errors}
          onChange={handleChange}
          onCarChange={handleCarChange}
        />
      )}

      {/* 네비게이션 버튼 */}
      <div className="mt-8 flex justify-between">
        <button
          type="button"
          onClick={handlePrev}
          disabled={currentStep === 1}
          className={`px-6 py-2 rounded-md font-medium transition-colors ${
            currentStep === 1
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          data-testid="onboarding-form-prev-button"
        >
          이전
        </button>
        <button
          type="button"
          onClick={handleNext}
          className="px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
          data-testid="onboarding-form-next-button"
        >
          {currentStep === TOTAL_STEPS ? '완료' : '다음'}
        </button>
      </div>
    </div>
  );
}
