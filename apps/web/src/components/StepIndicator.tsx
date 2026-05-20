interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  stepLabels: string[];
}

export function StepIndicator({ currentStep, totalSteps, stepLabels }: StepIndicatorProps) {
  return (
    <div className="mb-8 px-6" data-testid="step-indicator">
      {/* Progress line + circles row */}
      <div className="relative flex items-start justify-between">
        {/* Background line aligned to circle center (h-8 / 2 = 16px = top-4) */}
        <div className="absolute top-4 left-0 right-0 -translate-y-1/2 mx-4 h-0.5 bg-gray-200" />
        {/* Active line */}
        <div
          className="absolute top-4 left-0 -translate-y-1/2 mx-4 h-0.5 bg-amber-600 transition-all duration-300"
          style={{
            width: `${((currentStep - 1) / (totalSteps - 1)) * 100}%`,
          }}
        />

        {/* Step circles + labels */}
        {Array.from({ length: totalSteps }, (_, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;

          return (
            <div
              key={stepNumber}
              className="relative z-10 flex flex-col items-center"
            >
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  isCompleted
                    ? 'bg-amber-600 text-white'
                    : isCurrent
                      ? 'bg-amber-600 text-white ring-4 ring-amber-100'
                      : 'bg-gray-200 text-gray-500'
                }`}
                data-testid={`step-indicator-${stepNumber}`}
              >
                {isCompleted ? '✓' : stepNumber}
              </div>
              <span
                className={`mt-2 text-xs text-center whitespace-nowrap ${
                  isCurrent ? 'text-amber-600 font-medium' : 'text-gray-500'
                }`}
              >
                {stepLabels[index]}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
