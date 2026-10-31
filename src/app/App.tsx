import React, { useEffect, useState } from 'react';
import PortfolioShell from '@/components/layout/PortfolioShell';
import AppRoutes from './routes/AppRoutes';
import { useTheme } from '@/context/ThemeContext';
import { profileService } from '@/services/api';

export default function App() {
  const { themeStyle } = useTheme();
  const isMonochrome = themeStyle === 'monochrome';
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    profileService.getProfile()
      .then(data => setProfile(data))
      .catch(() => {});
  }, []);

  return (
    <PortfolioShell profile={profile} isMonochrome={isMonochrome}>
      <AppRoutes />
    </PortfolioShell>
  );
}
