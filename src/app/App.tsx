import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import PortfolioShell from '@/components/layout/PortfolioShell';
import AppRoutes from './routes/AppRoutes';
import { useTheme } from '@/context/ThemeContext';
import { profileService } from '@/services/api';

export default function App() {
  const { themeStyle } = useTheme();
  const isMonochrome = themeStyle === 'monochrome';
  const [profile, setProfile] = useState<any>(null);
  const location = useLocation();

  const isAdminRoute = location.pathname.startsWith('/admin');

  useEffect(() => {
    profileService.getProfile()
      .then(data => setProfile(data))
      .catch(() => {});
  }, []);

  if (isAdminRoute) {
    return <AppRoutes />;
  }

  return (
    <PortfolioShell profile={profile} isMonochrome={isMonochrome}>
      <AppRoutes />
    </PortfolioShell>
  );
}
