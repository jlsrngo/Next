import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import HomePage from '@/features/home/pages/HomePage';
import AboutPage from '@/features/about/pages/AboutPage';
import ProjectsPage from '@/features/projects/pages/ProjectsPage';
import DashboardPage from '@/features/dashboard/pages/DashboardPage';
import AchievementsPage from '@/features/achievements/pages/AchievementsPage';
import ContactPage from '@/features/contact/pages/ContactPage';
import AdminLayout from '@/features/admin/layouts/AdminLayout';
import AdminOverviewPage from '@/features/admin/pages/AdminOverviewPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/telemetry" element={<DashboardPage />} />
      <Route path="/github" element={<DashboardPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Admin Control Panel (Independent Layout) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverviewPage />} />
        <Route path="*" element={<AdminOverviewPage />} />
      </Route>

      {/* Locale routes */}
      <Route path="/:locale" element={<HomePage />} />
      <Route path="/:locale/about" element={<AboutPage />} />
      <Route path="/:locale/projects" element={<ProjectsPage />} />
      <Route path="/:locale/dashboard" element={<DashboardPage />} />
      <Route path="/:locale/telemetry" element={<DashboardPage />} />
      <Route path="/:locale/github" element={<DashboardPage />} />
      <Route path="/:locale/achievements" element={<AchievementsPage />} />
      <Route path="/:locale/contact" element={<ContactPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
