import { Routes, Route } from 'react-router-dom'
import { Toaster } from '@/components/ui/sonner'
import LandingPage from '@/pages/LandingPage'
import LoginPage from '@/pages/LoginPage'
import RegisterPage from '@/pages/RegisterPage'
import DashboardPage from '@/pages/DashboardPage'
import WizardPage from '@/pages/WizardPage'
import OutlinePage from '@/pages/OutlinePage'
import EditorPage from '@/pages/EditorPage'
import FAQPage from '@/pages/FAQPage'
import TermsPage from '@/pages/TermsPage'
import NotFoundPage from '@/pages/NotFoundPage'
import PublicLayout from '@/layouts/PublicLayout'
import AuthLayout from '@/layouts/AuthLayout'

function App() {
  return (
    <>
      <Toaster position="top-right" richColors closeButton />
      <Routes>
        <Route element={<PublicLayout />}>
          <Route path="/" element={<LandingPage />} />
          <Route path="/faq" element={<FAQPage />} />
        </Route>
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/new" element={<WizardPage />} />
        <Route path="/outline/:projectId" element={<OutlinePage />} />
        <Route path="/editor/:projectId" element={<EditorPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default App