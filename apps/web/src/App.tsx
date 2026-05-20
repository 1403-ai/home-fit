import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { GlossaryPage } from './pages/GlossaryPage';
import { HomePage } from './pages/HomePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { MyProfilePage } from './pages/MyProfilePage';

export function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/announcements/:seq/questions" element={<QuestionsPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
        <Route path="/glossary" element={<GlossaryPage />} />
      </Routes>
    </BrowserRouter>
  );
}
