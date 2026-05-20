import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { QuestionsPage } from './pages/QuestionsPage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/announcements/:seq/questions" element={<QuestionsPage />} />
      </Routes>
    </BrowserRouter>
  );
}
