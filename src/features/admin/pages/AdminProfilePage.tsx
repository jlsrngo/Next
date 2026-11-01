import React, { useState, useEffect } from 'react';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Globe,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  Edit3,
  X,
  Loader2,
  AlertTriangle,
} from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { profileService } from '@/services/api';
import { optimizeCloudinaryUrl } from '@/utils/cloudinary';

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form state
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bioHome, setBioHome] = useState('');
  const [bioAbout, setBioAbout] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

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

  const openEditModal = () => {
    setFullName(profile?.fullName || profile?.name || '');
    setHeadline(profile?.headline || '');
    setBioHome(profile?.bioHome || profile?.bio_home || '');
    setBioAbout(profile?.bioAbout || profile?.bio_about || '');
    setEmail(profile?.email || '');
    setPhone(profile?.phone || '');
    setLocation(profile?.location || '');
    setWebsite(profile?.website || '');
    setGithubUrl(profile?.githubUrl || profile?.github_url || '');
    setLinkedinUrl(profile?.linkedinUrl || profile?.linkedin_url || '');
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fullName,
          headline,
          bioHome,
          bioAbout,
          email,
          phone,
          location,
          website,
          githubUrl,
          linkedinUrl,
        }),
      });
      if (!res.ok) throw new Error('Failed to update profile');
      setFeedback({ type: 'success', message: 'Profile specification updated successfully.' });
      setIsModalOpen(false);
      await fetchProfile();
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'Update failed.' });
    } finally {
      setSubmitting(false);
    }
  };

  const name = profile?.fullName || profile?.name || 'Julio Siringoringo';
  const displayHeadline = profile?.headline || 'Full Stack Engineer & Distributed Systems';
  const avatar = optimizeCloudinaryUrl(profile?.avatarUrl || profile?.avatar_url);

  return (
    <div className="space-y-6 animate-fade-in text-ink">
      {/* Header HUD */}
      <div className="border-b border-line pb-5 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
            [ 00 // OPERATOR DOSSIER & IDENTITY MATRIX ]
          </div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
            PROFILE // <span className="font-mono text-faint font-normal">SPECIFICATION</span>
          </h1>
          <p className="text-xs text-faint mt-1 font-mono">
            Identity registry, public bio statements, and primary contact endpoints stored in PostgreSQL.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={openEditModal}
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-4 py-2 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs"
          >
            <Edit3 size={14} />
            <span>EDIT SPEC</span>
          </button>
          <button
            onClick={fetchProfile}
            className="flex items-center gap-1.5 border border-line bg-bg-raised hover:bg-bg-sunken px-3 py-2 font-mono text-xs uppercase tracking-wider text-ink transition-all"
          >
            <RefreshCw size={13} className={loading ? 'animate-spin' : ''} />
            <span>SYNC</span>
          </button>
        </div>
      </div>

      {feedback && (
        <div
          className={`border px-4 py-3 font-mono text-xs flex items-center justify-between transition-all ${
            feedback.type === 'success'
              ? 'border-line bg-bg-raised text-ink'
              : 'border-red-500 bg-red-500/10 text-red-600 dark:text-red-400'
          }`}
        >
          <div className="flex items-center gap-2">
            {feedback.type === 'success' ? (
              <CheckCircle2 size={14} className="text-emerald-500 shrink-0" />
            ) : (
              <AlertTriangle size={14} className="text-red-500 shrink-0" />
            )}
            <span>{feedback.message}</span>
          </div>
          <button onClick={() => setFeedback(null)} className="text-faint hover:text-ink">
            <X size={14} />
          </button>
        </div>
      )}

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

      {/* Edit Profile Spec Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="relative w-full max-w-2xl border border-line bg-bg text-ink p-6 shadow-2xl blueprint-grid max-h-[90vh] overflow-y-auto">
            <CornerCrosses />
            <div className="flex items-center justify-between border-b border-line pb-3 mb-4">
              <div>
                <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint">
                  [ OPERATOR DOSSIER CONFIGURATION ]
                </div>
                <h3 className="font-display text-xl font-bold uppercase">EDIT PROFILE SPECIFICATION</h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 border border-line hover:bg-bg-sunken text-ink transition-all"
              >
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSave} className="space-y-4 font-mono text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">Full Name *</label>
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">Professional Headline</label>
                  <input
                    type="text"
                    value={headline}
                    onChange={(e) => setHeadline(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">Home Synopsis (Hero Bio)</label>
                <textarea
                  rows={2}
                  value={bioHome}
                  onChange={(e) => setBioHome(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-sans text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div>
                <label className="block text-faint uppercase font-bold mb-1">About Dossier (Engineering Bio)</label>
                <textarea
                  rows={4}
                  value={bioAbout}
                  onChange={(e) => setBioAbout(e.target.value)}
                  className="w-full border border-line bg-bg-raised p-2 text-ink font-sans text-xs focus:outline-none focus:border-line-strong"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">Email</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">Phone</label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">Geographic Location</label>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">Website URL</label>
                  <input
                    type="text"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">GitHub URL</label>
                  <input
                    type="text"
                    value={githubUrl}
                    onChange={(e) => setGithubUrl(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
                <div>
                  <label className="block text-faint uppercase font-bold mb-1">LinkedIn URL</label>
                  <input
                    type="text"
                    value={linkedinUrl}
                    onChange={(e) => setLinkedinUrl(e.target.value)}
                    className="w-full border border-line bg-bg-raised p-2 text-ink font-mono text-xs focus:outline-none focus:border-line-strong"
                  />
                </div>
              </div>

              <div className="border-t border-line pt-4 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="border border-line bg-bg hover:bg-bg-sunken px-4 py-2 font-mono text-xs uppercase text-ink"
                >
                  CANCEL
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-5 py-2 font-mono text-xs uppercase font-bold flex items-center gap-1.5"
                >
                  {submitting && <Loader2 size={13} className="animate-spin" />}
                  <span>SAVE SPEC</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
