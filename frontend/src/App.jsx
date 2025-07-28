import { Routes, Route } from 'react-router-dom'
import LoginPage from './pages/Login'
import HomePage from './pages/Home'
import MindfulnessPage from './pages/Mindfulness'
import ProgressPage from './pages/Progress'
import MoodTimerPage from './pages/mood/timer'
import MoodRecordPage from './pages/mood/record'
import AuthLayout from './components/AuthLayout'
import GuestLayout from './components/GuestLayout'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Routes>
        <Route element={<GuestLayout />}>
          <Route path="/login" element={<LoginPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/mindfulness" element={<MindfulnessPage />} />
          <Route path="/progress" element={<ProgressPage />} />
          <Route path="/mood/timer" element={<MoodTimerPage />} />
          <Route path="/mood/record" element={<MoodRecordPage />} />
        </Route>
      </Routes>
    </div>
  )
}

export default App
