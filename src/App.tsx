import { Routes, Route, Navigate } from 'react-router-dom'
import PortfolioShell from './components/PortfolioShell'
import HomePage from './pages/HomePage'
import AboutPage from './pages/AboutPage'
import ProjectsPage from './pages/ProjectsPage'
import DashboardPage from './pages/DashboardPage'
import AchievementsPage from './pages/AchievementsPage'
import ContactPage from './pages/ContactPage'
import { useTheme } from './context/ThemeContext'
import { useEffect, useState } from 'react'

export default function App() {
  const { themeStyle } = useTheme()
  const isMonochrome = themeStyle === 'monochrome'
  const [profile, setProfile] = useState<any>(null)

  useEffect(() => {
    fetch('/api/profile')
      .then(r => r.json())
      .then(data => setProfile(data))
      .catch(() => {})
  }, [])

  return (
    <PortfolioShell profile={profile} isMonochrome={isMonochrome}>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/projects" element={<ProjectsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/github" element={<DashboardPage />} />
        <Route path="/achievements" element={<AchievementsPage />} />
        <Route path="/contact" element={<ContactPage />} />
        
        {/* Support locale prefixes seamlessly */}
        <Route path="/:locale" element={<HomePage />} />
        <Route path="/:locale/about" element={<AboutPage />} />
        <Route path="/:locale/projects" element={<ProjectsPage />} />
        <Route path="/:locale/dashboard" element={<DashboardPage />} />
        <Route path="/:locale/github" element={<DashboardPage />} />
        <Route path="/:locale/achievements" element={<AchievementsPage />} />
        <Route path="/:locale/contact" element={<ContactPage />} />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </PortfolioShell>
  )
}
