import React, { useState, useEffect } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import DashboardShell from './DashboardShell';
import { profileService } from '@/services/api';
import { useSession } from 'next-auth/react';

export default function AdminLayout() {
  const { status } = useSession();
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    profileService.getProfile()
      .then(p => setProfile(p))
      .catch(() => {});
  }, []);

  if (status === 'unauthenticated') {
    return <Navigate to="/" replace />;
  }

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

