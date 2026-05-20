import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { GNB } from './components/GNB';
import { AnnouncementsPage } from './pages/AnnouncementsPage';
import { HomePage } from './pages/HomePage';
import { MyProfilePage } from './pages/MyProfilePage';
import { OnboardingPage } from './pages/OnboardingPage';
import { QuestionsPage } from './pages/QuestionsPage';
import { StatusPage } from './pages/StatusPage';

export function App() {
  return (
    <BrowserRouter>
      <GNB />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/onboarding" element={<OnboardingPage />} />
        <Route path="/announcements" element={<AnnouncementsPage />} />
        <Route path="/announcements/:seq/questions" element={<QuestionsPage />} />
        <Route path="/my-profile" element={<MyProfilePage />} />
        <Route path="/status" element={<StatusPage />} />
      </Routes>
    </BrowserRouter>
  );
}
