import { Routes, Route } from 'react-router-dom'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import WizardPage from '@/pages/WizardPage'
import OutlinePage from '@/pages/OutlinePage'
import EditorPage from '@/pages/EditorPage'
import NotFoundPage from '@/pages/NotFoundPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/new" element={<WizardPage />} />
      <Route path="/outline/:projectId" element={<OutlinePage />} />
      <Route path="/editor/:projectId" element={<EditorPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

export default App