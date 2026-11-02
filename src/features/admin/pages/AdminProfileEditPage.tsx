import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2, User, Mail, MapPin, Globe, Phone, Save } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import ImageUploadAdjuster from '@/components/ui/ImageUploadAdjuster';
import { profileService } from '@/services/api';
import type { Profile } from '@/types/profile.types';
import AdminFormHeaderHUD from '../components/AdminFormHeaderHUD';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminProfileEditPage() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);

  // Form State
  const [fullName, setFullName] = useState('');
  const [headline, setHeadline] = useState('');
  const [bioHome, setBioHome] = useState('');
  const [bioAbout, setBioAbout] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [website, setWebsite] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [linkedinUrl, setLinkedinUrl] = useState('');

  useEffect(() => {
    profileService
      .getProfile()
      .then((data: Profile) => {
        if (data) {
          setFullName(data.fullName || data.name || '');
          setHeadline(data.headline || '');
          setBioHome(data.bioHome || data.bio_home || '');
          setBioAbout(data.bioAbout || data.bio_about || '');
          setAvatarUrl(data.avatarUrl || data.avatar_url || '');
          setEmail(data.email || '');
          setPhone(data.phone || '');
          setLocation(data.location || '');
          setWebsite(data.website || '');
          setGithubUrl(data.githubUrl || data.github_url || '');
          setLinkedinUrl(data.linkedinUrl || data.linkedin_url || '');
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim()) {
      setFeedback({ type: 'error', message: 'Full Name cannot be empty.' });
      return;
    }

    setSubmitting(true);
    const payload = {
      fullName: fullName.trim(),
      headline: headline.trim(),
      bioHome: bioHome.trim(),
      bioAbout: bioAbout.trim(),
      avatarUrl: avatarUrl.trim() || undefined,
      email: email.trim(),
      phone: phone.trim(),
      location: location.trim(),
      website: website.trim(),
      githubUrl: githubUrl.trim(),
      linkedinUrl: linkedinUrl.trim(),
    };

    try {
      await profileService.updateProfile(payload);
      setFeedback({ type: 'success', message: 'Profile specification saved successfully! Redirecting...' });
      setTimeout(() => {
        navigate('/admin/profile');
      }, 1000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Saving failed';
      setFeedback({ type: 'error', message });
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="border border-line bg-bg-raised p-16 text-center font-mono text-xs text-faint">
        <Loader2 size={24} className="animate-spin mx-auto mb-3 text-ink" />
        <div>RETRIEVING OPERATOR SPECIFICATION FROM DATABASE...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <AdminFormHeaderHUD
        returnTo="/admin/profile"
        returnLabel="RETURN TO PROFILE SPEC"
        systemCode="[ 00 // OPERATOR DOSSIER CONFIGURATION ]"
        title="EDIT PROFILE //"
        titleHighlight="SPECIFICATION"
        discardTo="/admin/profile"
        submitLabel="SAVE DOSSIER"
        isSubmitting={submitting}
        onSubmit={handleSubmit}
      />

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Section 1: Avatar Image Adjuster Component */}
        <ImageUploadAdjuster
          value={avatarUrl}
          onChange={(newVal) => setAvatarUrl(newVal)}
          aspectRatio="square"
          label="FOTO PROFIL / AVATAR"
        />

        {/* Section 2: Primary Identity */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2 flex items-center gap-2">
            <User size={13} />
            <span>[ 01 // PRIMARY IDENTITY REGISTRY ]</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">Full Operator Name *</label>
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="e.g. Julio Siringoringo"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">Professional Headline / Role</label>
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. Full Stack Developer & Systems Engineer"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 3: Narrative Statements */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2">
            [ 02 // NARRATIVE STATEMENTS & SYNOPSIS ]
          </div>

          <div className="space-y-5 font-mono text-xs">
            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                Home Synopsis (Hero statement visible on portfolio landing)
              </label>
              <textarea
                rows={3}
                value={bioHome}
                onChange={(e) => setBioHome(e.target.value)}
                placeholder="Brief high-impact introduction for the home page hero..."
                className="w-full border border-line bg-bg p-3 text-ink font-sans text-xs leading-relaxed focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">
                About Dossier (Comprehensive background & engineering trajectory)
              </label>
              <textarea
                rows={6}
                value={bioAbout}
                onChange={(e) => setBioAbout(e.target.value)}
                placeholder="Detailed technical story, architectural philosophies, and journey..."
                className="w-full border border-line bg-bg p-3 text-ink font-sans text-xs leading-relaxed focus:outline-none focus:border-line-strong transition-all"
              />
            </div>
          </div>
        </div>

        {/* Section 4: Communication & Relays */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2">
            [ 03 // TRANSMISSION ENDPOINTS & CHANNELS ]
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 font-mono text-xs">
            <div>
              <label className="block text-faint uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <Mail size={12} />
                <span>Primary Email Endpoint</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="julio.siringoringo@example.com"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <Phone size={12} />
                <span>Telephone / Relay Contact</span>
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="+62 821-xxxx-xxxx"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <MapPin size={12} />
                <span>Geographic Base</span>
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="Indonesia / Remote UTC+7"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5 flex items-center gap-1.5">
                <Globe size={12} />
                <span>Public Domain URL</span>
              </label>
              <input
                type="text"
                value={website}
                onChange={(e) => setWebsite(e.target.value)}
                placeholder="https://jlsrngo.com"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">GitHub Spec URL</label>
              <input
                type="text"
                value={githubUrl}
                onChange={(e) => setGithubUrl(e.target.value)}
                placeholder="https://github.com/jlsrngo"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>

            <div>
              <label className="block text-faint uppercase font-bold mb-1.5">LinkedIn Spec URL</label>
              <input
                type="text"
                value={linkedinUrl}
                onChange={(e) => setLinkedinUrl(e.target.value)}
                placeholder="https://linkedin.com/in/jlsrngo"
                className="w-full border border-line bg-bg p-3 text-ink font-mono text-xs focus:outline-none focus:border-line-strong transition-all"
              />
            </div>
          </div>
        </div>

        {/* Bottom Actions Bar */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-line">
          <button
            type="submit"
            disabled={submitting}
            className="flex items-center gap-1.5 border border-line bg-invert-bg text-invert-fg hover:opacity-90 px-6 py-2.5 font-mono text-xs uppercase font-bold tracking-wider transition-all shadow-xs disabled:opacity-50"
          >
            {submitting ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
            <span>SAVE PROFILE SPECIFICATION</span>
          </button>
        </div>
      </form>
    </div>
  );
}
