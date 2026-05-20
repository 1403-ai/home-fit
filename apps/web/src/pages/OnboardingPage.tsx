import { OnboardingForm } from '../components/OnboardingForm';

export function OnboardingPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-2xl mx-auto">
        <header className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-gray-900">프로필 입력</h1>
          <p className="mt-2 text-gray-600">
            공공주택 자격 확인을 위한 기본 정보를 입력해 주세요.
          </p>
        </header>
        <OnboardingForm />
      </div>
    </main>
  );
}
