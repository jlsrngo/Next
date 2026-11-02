import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Key,
  Server,
  Cpu,
  Database,
  Lock,
  Mail,
  Eye,
  EyeOff,
  Save,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useTranslations, useLocale } from '@/context/I18nContext';
import { getAdminCredentials, updateAdminCredentials } from '@/lib/next-auth-shim';
import AdminFeedbackBanner, { type AdminFeedbackState } from '../components/AdminFeedbackBanner';

export default function AdminAccountPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isId = locale === 'id';

  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<AdminFeedbackState | null>(null);

  useEffect(() => {
    const creds = getAdminCredentials();
    setEmail(creds.email || 'admin@portfolio.com');
  }, []);

  const handleSaveCredentials = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedback(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !trimmedEmail.includes('@')) {
      setFeedback({
        type: 'error',
        message: isId ? 'Format email tidak valid.' : 'Invalid email format.',
      });
      return;
    }

    if (newPassword) {
      if (newPassword.length < 6) {
        setFeedback({
          type: 'error',
          message: isId
            ? 'Password baru minimal harus 6 karakter.'
            : 'New password must be at least 6 characters.',
        });
        return;
      }

      if (newPassword !== confirmPassword) {
        setFeedback({
          type: 'error',
          message: isId
            ? 'Konfirmasi password tidak cocok dengan password baru.'
            : 'Password confirmation does not match.',
        });
        return;
      }
    }

    setSubmitting(true);
    try {
      const ok = updateAdminCredentials(trimmedEmail, newPassword || undefined);
      if (ok) {
        setFeedback({
          type: 'success',
          message: isId
            ? 'Kredensial akun root admin berhasil diperbarui! Gunakan email dan password ini untuk login berikutnya.'
            : 'Root operator credentials updated successfully! Use these credentials for next sign-in.',
        });
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setFeedback({
          type: 'error',
          message: isId ? 'Gagal menyimpan kredensial.' : 'Failed to save credentials.',
        });
      }
    } catch {
      setFeedback({
        type: 'error',
        message: isId ? 'Terjadi kesalahan sistem.' : 'A system error occurred.',
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <div className="border-b border-line pb-5">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
          {isId ? '[ 08 // DOSIR KEAMANAN & AUTENTIKASI ENGINE ]' : '[ 08 // SECURITY DOSSIER & ENGINE AUTHENTICATION ]'}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
          {isId ? 'AKUN //' : 'ACCOUNT //'} <span className="font-mono text-faint font-normal">{isId ? 'KREDENSIAL & SPESIFIKASI' : 'CREDENTIALS & SPEC'}</span>
        </h1>
        <p className="text-xs text-faint mt-1 font-mono">
          {isId
            ? 'Kelola email dan password root operator, izin keamanan kriptografis, dan telemetri daemon.'
            : 'Manage root operator email and password, cryptographic clearances, and daemon telemetry.'}
        </p>
      </div>

      {/* Dismissible Feedback Banner */}
      <AdminFeedbackBanner feedback={feedback} onDismiss={() => setFeedback(null)} />

      {/* Section 1: Edit Account Email & Password */}
      <div className="border border-line bg-bg-raised p-6 relative">
        <CornerCrosses />
        <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2 flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Key size={13} />
            <span>{isId ? '[ 01 // EDIT EMAIL & PASSWORD OPERATOR ]' : '[ 01 // EDIT OPERATOR EMAIL & PASSWORD ]'}</span>
          </span>
          <span className="text-[9px] border border-line bg-bg px-2 py-0.5 text-emerald-500 font-bold">
            ACTIVE SESSION
          </span>
        </div>

        <form onSubmit={handleSaveCredentials} className="space-y-5 font-mono text-xs">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Operator Email */}
            <div className="space-y-1.5 md:col-span-2">
              <label className="block text-faint uppercase font-bold">
                {isId ? 'EMAIL OPERATOR / ROOT LOGIN *' : 'OPERATOR EMAIL / ROOT LOGIN *'}
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@portfolio.com"
                  className="w-full border border-line bg-bg p-3 pl-9 text-ink font-mono text-xs focus:outline-hidden focus:border-line-strong transition-all"
                />
                <Mail size={14} className="absolute left-3 top-3.5 text-faint pointer-events-none" />
              </div>
              <span className="text-[10px] text-faint block">
                {isId
                  ? 'Email ini digunakan untuk mengakses dashboard control panel /admin.'
                  : 'This email is used to access the control panel dashboard /admin.'}
              </span>
            </div>

            {/* New Password */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between">
                <label className="block text-faint uppercase font-bold">
                  {isId ? 'PASSWORD BARU' : 'NEW PASSWORD'}
                </label>
                <span className="text-[10px] text-faint">
                  {isId ? '(Kosongkan jika tidak diubah)' : '(Leave blank to keep current)'}
                </span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="••••••••"
                  minLength={6}
                  className="w-full border border-line bg-bg p-3 pl-9 pr-10 text-ink font-mono text-xs focus:outline-hidden focus:border-line-strong transition-all"
                />
                <Lock size={14} className="absolute left-3 top-3.5 text-faint pointer-events-none" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-faint hover:text-ink transition-colors"
                >
                  {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                </button>
              </div>
            </div>

            {/* Confirm New Password */}
            <div className="space-y-1.5">
              <label className="block text-faint uppercase font-bold">
                {isId ? 'KONFIRMASI PASSWORD BARU' : 'CONFIRM NEW PASSWORD'}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="••••••••"
                  disabled={!newPassword}
                  className="w-full border border-line bg-bg p-3 pl-9 text-ink font-mono text-xs focus:outline-hidden focus:border-line-strong transition-all disabled:opacity-40"
                />
                <Lock size={14} className="absolute left-3 top-3.5 text-faint pointer-events-none" />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-line flex-wrap gap-3">
            <span className="text-[10px] text-faint">
              {isId
                ? 'Minimal 6 karakter. Perubahan disimpan secara instan ke autentikasi sistem.'
                : 'Min 6 chars. Changes are instantly stored to system authentication.'}
            </span>
            <button
              type="submit"
              disabled={submitting}
              className="inline-flex items-center gap-2 border border-line bg-invert-bg text-invert-fg px-5 py-2.5 font-mono text-xs uppercase font-bold hover:opacity-90 transition-all shadow-xs disabled:opacity-50"
            >
              <Save size={13} />
              <span>{isId ? 'SIMPAN PERUBAHAN AKUN' : 'SAVE ACCOUNT CREDENTIALS'}</span>
            </button>
          </div>
        </form>
      </div>

      {/* Section 2: Diagnostics & System Telemetry */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operator Credentials */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2">
            {isId ? '[ 02 // IZIN OPERATOR ]' : '[ 02 // OPERATOR CLEARANCE ]'}
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint">{isId ? 'PERAN OPERATOR:' : 'OPERATOR ROLE:'}</span>
              <span className="font-bold border border-line bg-bg px-2 py-0.5">{isId ? 'ADMINISTRATOR UTAMA' : 'ROOT ADMINISTRATOR'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint">{isId ? 'METODE AKSES:' : 'ACCESS METHOD:'}</span>
              <span className="font-bold">{isId ? 'TANDA TANGAN SESI' : 'SESSION SIGNATURE'}</span>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint">{isId ? 'IDENTITAS UTAMA:' : 'PRIMARY IDENTITY:'}</span>
              <span className="font-bold text-ink truncate max-w-[200px]">{email || 'admin@portfolio.com'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-faint">{isId ? 'TINGKAT KEAMANAN:' : 'SECURITY LEVEL:'}</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <ShieldCheck size={14} /> {isId ? 'AKSES PENUH' : 'FULL ACCESS'}
              </span>
            </div>
          </div>
        </div>

        {/* Backend Daemon Telemetry */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4 border-b border-line pb-2">
            {isId ? '[ 03 // STATUS DAEMON RUST AXUM ]' : '[ 03 // RUST AXUM DAEMON STATUS ]'}
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint flex items-center gap-1.5">
                <Cpu size={13} /> {isId ? 'MESIN:' : 'ENGINE:'}
              </span>
              <span className="font-bold">RUST AXUM 0.7 + TOKIO</span>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint flex items-center gap-1.5">
                <Database size={13} /> {isId ? 'BASIS DATA:' : 'DATABASE:'}
              </span>
              <span className="font-bold">NEON POSTGRESQL (TLS)</span>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint flex items-center gap-1.5">
                <Server size={13} /> {isId ? 'PORT JARINGAN:' : 'PORT BINDING:'}
              </span>
              <span className="font-bold">127.0.0.1:8080 (PROXIED VIA 3000)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-faint">{isId ? 'DAEMON CRAWLER:' : 'CRAWLER DAEMON:'}</span>
              <span className="font-bold text-emerald-500">{isId ? 'AKTIF (30 MENIT CRON)' : 'ACTIVE (30 MIN CRON)'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
