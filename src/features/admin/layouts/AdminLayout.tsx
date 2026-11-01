import React, { useState, useEffect } from 'react';
import { Outlet } from 'react-router-dom';
import DashboardShell from '@/app/dashboard/DashboardShell';
import { profileService } from '@/services/api';

export default function AdminLayout() {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    profileService.getProfile()
      .then(p => setProfile(p))
      .catch(() => {});
  }, []);

  return (
    <DashboardShell
      profileName={profile?.fullName || profile?.name || 'Julio Siringoringo'}
      profileAvatar={profile?.avatarUrl || profile?.avatar_url || null}
      email={profile?.email || 'admin@portfolio.com'}
    >
      <Outlet />
    </DashboardShell>
  );
}
