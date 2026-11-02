import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Globe,
  RefreshCw,
  Edit3,
} from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { profileService } from '@/services/api';
import type { Profile } from '@/types/profile.types';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary';
import AdminPageHeaderHUD from '../components/AdminPageHeaderHUD';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const data = await profileService.getProfile();
      setProfile(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const name = profile?.fullName || profile?.name || 'Julio Siringoringo';
  const displayHeadline = profile?.headline || 'Full Stack Engineer & Distributed Systems';
  const avatar = optimizeCloudinaryUrl(profile?.avatarUrl || profile?.avatar_url);

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminPageHeaderHUD
        systemCode="[ 00 // OPERATOR DOSSIER & IDENTITY MATRIX ]"
        title="PROFILE //"
        titleHighlight="SPECIFICATION"
        description="Identity registry, public bio statements, and primary contact endpoints stored in PostgreSQL."
        actions={
          <>
            <Link
              to="/admin/profile/edit"
              className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
            >
              <Edit3 size={14} />
              <span>EDIT PROFILE</span>
            </Link>
            <button
              type="button"
              onClick={fetchProfile}
              className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
            >
              <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
              <span>SYNC</span>
            </button>
          </>
        }
      />

      {/* Main Dossier Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Avatar & Primary Spec */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4">
            [ IDENTITY DOSSIER ]
          </div>

          <div className="w-24 h-24 border border-line bg-bg overflow-hidden mb-4 relative">
            {avatar ? (
              <img src={avatar} alt={name} className="w-full h-full object-cover grayscale contrast-125" />
            ) : (
              <div className="w-full h-full flex items-center justify-center font-mono text-xl font-bold">
                {name.slice(0, 2).toUpperCase()}
              </div>
            )}
          </div>

          <div className="space-y-1">
            <h2 className="font-display text-xl font-bold text-ink">{name}</h2>
            <p className="font-mono text-xs text-faint">{displayHeadline}</p>
          </div>

          <div className="mt-6 pt-4 border-t border-line space-y-2.5 font-mono text-xs">
            <div className="flex items-center justify-between text-faint">
              <span>STATUS:</span>
              <span className="font-bold text-ink">ACTIVE / VERIFIED</span>
            </div>
            <div className="flex items-center justify-between text-faint">
              <span>NODE:</span>
              <span className="font-bold text-ink">TOKIO NATIVE DAEMON</span>
            </div>
            <div className="flex items-center justify-between text-faint">
              <span>DATABASE:</span>
              <span className="font-bold text-ink">NEON POSTGRESQL</span>
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-line">
            <Link
              to="/admin/profile/edit"
              className="w-full block text-center border border-line bg-bg hover:bg-bg-sunken py-2 font-mono text-xs uppercase font-bold text-ink transition-all"
            >
              MODIFY IDENTITY SPEC →
            </Link>
          </div>
        </div>

        {/* Right Column: Statements & Endpoints */}
        <div className="lg:col-span-2 space-y-6">
          {/* Bio Statements */}
          <div className="border border-line bg-bg-raised p-6 relative">
            <CornerCrosses />
            <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-3">
              [ SYNOPSIS & STATEMENT MATRICES ]
            </div>

            <div className="space-y-4 font-mono text-xs">
              <div>
                <span className="text-[10px] text-faint uppercase font-bold tracking-wider block mb-1">
                  HOME SYNOPSIS (PORTFOLIO HERO):
                </span>
                <p className="bg-bg border border-line p-3 font-sans text-xs leading-relaxed text-ink/90">
                  {profile?.bioHome || profile?.bio_home || 'No home synopsis registered.'}
                </p>
              </div>

              <div>
                <span className="text-[10px] text-faint uppercase font-bold tracking-wider block mb-1">
                  ABOUT DOSSIER (ENGINEERING BACKGROUND):
                </span>
                <p className="bg-bg border border-line p-3 font-sans text-xs leading-relaxed text-ink/90 whitespace-pre-line">
                  {profile?.bioAbout || profile?.bio_about || 'No detailed background registered.'}
                </p>
              </div>
            </div>
          </div>

          {/* Contact Endpoints */}
          <div className="border border-line bg-bg-raised p-6 relative">
            <CornerCrosses />
            <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4">
              [ TRANSMISSION ENDPOINTS ]
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 font-mono text-xs">
              <div className="border border-line bg-bg p-3 flex items-center gap-3">
                <Mail size={16} className="text-faint" />
                <div className="min-w-0">
                  <div className="text-[9px] uppercase text-faint">PRIMARY EMAIL</div>
                  <div className="font-bold truncate">{profile?.email || 'admin@portfolio.com'}</div>
                </div>
              </div>

              <div className="border border-line bg-bg p-3 flex items-center gap-3">
                <MapPin size={16} className="text-faint" />
                <div className="min-w-0">
                  <div className="text-[9px] uppercase text-faint">GEOGRAPHIC BASE</div>
                  <div className="font-bold truncate">{profile?.location || 'Indonesia'}</div>
                </div>
              </div>

              <div className="border border-line bg-bg p-3 flex items-center gap-3">
                <Globe size={16} className="text-faint" />
                <div className="min-w-0">
                  <div className="text-[9px] uppercase text-faint">PUBLIC DOMAIN</div>
                  <div className="font-bold truncate">{profile?.website || 'localhost:3000'}</div>
                </div>
              </div>

              <div className="border border-line bg-bg p-3 flex items-center gap-3">
                <Phone size={16} className="text-faint" />
                <div className="min-w-0">
                  <div className="text-[9px] uppercase text-faint">TELEPHONE RELAY</div>
                  <div className="font-bold truncate">{profile?.phone || '+62 821-xxxx-xxxx'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
