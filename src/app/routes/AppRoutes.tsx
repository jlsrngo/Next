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
import AdminProjectsPage from '@/features/admin/pages/AdminProjectsPage';
import AdminProjectFormPage from '@/features/admin/pages/AdminProjectFormPage';
import AdminSkillsPage from '@/features/admin/pages/AdminSkillsPage';
import AdminSkillFormPage from '@/features/admin/pages/AdminSkillFormPage';
import AdminProfilePage from '@/features/admin/pages/AdminProfilePage';
import AdminProfileEditPage from '@/features/admin/pages/AdminProfileEditPage';
import AdminAchievementsPage from '@/features/admin/pages/AdminAchievementsPage';
import AdminAchievementFormPage from '@/features/admin/pages/AdminAchievementFormPage';
import AdminExperiencesPage from '@/features/admin/pages/AdminExperiencesPage';
import AdminExperienceFormPage from '@/features/admin/pages/AdminExperienceFormPage';
import AdminEducationPage from '@/features/admin/pages/AdminEducationPage';
import AdminEducationFormPage from '@/features/admin/pages/AdminEducationFormPage';
import AdminSocialLinksPage from '@/features/admin/pages/AdminSocialLinksPage';
import AdminSocialLinkFormPage from '@/features/admin/pages/AdminSocialLinkFormPage';
import AdminThemePage from '@/features/admin/pages/AdminThemePage';
import AdminAccountPage from '@/features/admin/pages/AdminAccountPage';
import AdminChangelogPage from '@/features/admin/pages/AdminChangelogPage';

export default function AppRoutes() {
  return (
    <Routes>
      {/* Admin Workstation & Control Panel (Strict Independent Layout & Dedicated Pages) */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminOverviewPage />} />
        
        {/* Profile */}
        <Route path="profile" element={<AdminProfilePage />} />
        <Route path="profile/edit" element={<AdminProfileEditPage />} />

        {/* Projects */}
        <Route path="projects" element={<AdminProjectsPage />} />
        <Route path="projects/new" element={<AdminProjectFormPage />} />
        <Route path="projects/:id/edit" element={<AdminProjectFormPage />} />

        {/* Skills */}
        <Route path="skills" element={<AdminSkillsPage />} />
        <Route path="skills/new" element={<AdminSkillFormPage />} />

        {/* Achievements */}
        <Route path="achievements" element={<AdminAchievementsPage />} />
        <Route path="achievements/new" element={<AdminAchievementFormPage />} />
        <Route path="achievements/:id/edit" element={<AdminAchievementFormPage />} />

        {/* Experiences */}
        <Route path="experiences" element={<AdminExperiencesPage />} />
        <Route path="experiences/new" element={<AdminExperienceFormPage />} />
        <Route path="experiences/:id/edit" element={<AdminExperienceFormPage />} />

        {/* Education */}
        <Route path="education" element={<AdminEducationPage />} />
        <Route path="education/new" element={<AdminEducationFormPage />} />
        <Route path="education/:id/edit" element={<AdminEducationFormPage />} />

        {/* Social Links */}
        <Route path="social-links" element={<AdminSocialLinksPage />} />
        <Route path="social-links/new" element={<AdminSocialLinkFormPage />} />
        <Route path="social-links/:id/edit" element={<AdminSocialLinkFormPage />} />

        {/* System & Configuration */}
        <Route path="theme" element={<AdminThemePage />} />
        <Route path="account" element={<AdminAccountPage />} />
        <Route path="changelog" element={<AdminChangelogPage />} />

        <Route path="*" element={<AdminOverviewPage />} />
      </Route>

      {/* Redirect old dashboard URLs to /admin */}
      <Route path="/dashboard/profile" element={<Navigate to="/admin/profile" replace />} />
      <Route path="/dashboard/profile/edit" element={<Navigate to="/admin/profile/edit" replace />} />
      <Route path="/dashboard/projects" element={<Navigate to="/admin/projects" replace />} />
      <Route path="/dashboard/projects/new" element={<Navigate to="/admin/projects/new" replace />} />
      <Route path="/dashboard/projects/:id/edit" element={<Navigate to="/admin/projects" replace />} />
      <Route path="/dashboard/skills" element={<Navigate to="/admin/skills" replace />} />
      <Route path="/dashboard/achievements" element={<Navigate to="/admin/achievements" replace />} />
      <Route path="/dashboard/experiences" element={<Navigate to="/admin/experiences" replace />} />
      <Route path="/dashboard/education" element={<Navigate to="/admin/education" replace />} />
      <Route path="/dashboard/social-links" element={<Navigate to="/admin/social-links" replace />} />
      <Route path="/dashboard/theme" element={<Navigate to="/admin/theme" replace />} />
      <Route path="/dashboard/account" element={<Navigate to="/admin/account" replace />} />
      <Route path="/dashboard/changelog" element={<Navigate to="/admin/changelog" replace />} />

      {/* Public Pages */}
      <Route path="/" element={<HomePage />} />
      <Route path="/about" element={<AboutPage />} />
      <Route path="/projects" element={<ProjectsPage />} />
      <Route path="/dashboard" element={<DashboardPage />} />
      <Route path="/telemetry" element={<DashboardPage />} />
      <Route path="/github" element={<DashboardPage />} />
      <Route path="/achievements" element={<AchievementsPage />} />
      <Route path="/contact" element={<ContactPage />} />

      {/* Locale routes (en | id) */}
      <Route path="/en" element={<HomePage />} />
      <Route path="/en/about" element={<AboutPage />} />
      <Route path="/en/projects" element={<ProjectsPage />} />
      <Route path="/en/dashboard" element={<DashboardPage />} />
      <Route path="/en/telemetry" element={<DashboardPage />} />
      <Route path="/en/github" element={<DashboardPage />} />
      <Route path="/en/achievements" element={<AchievementsPage />} />
      <Route path="/en/contact" element={<ContactPage />} />

      <Route path="/id" element={<HomePage />} />
      <Route path="/id/about" element={<AboutPage />} />
      <Route path="/id/projects" element={<ProjectsPage />} />
      <Route path="/id/dashboard" element={<DashboardPage />} />
      <Route path="/id/telemetry" element={<DashboardPage />} />
      <Route path="/id/github" element={<DashboardPage />} />
      <Route path="/id/achievements" element={<AchievementsPage />} />
      <Route path="/id/contact" element={<ContactPage />} />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
