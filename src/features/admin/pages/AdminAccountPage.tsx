import React from 'react';
import { ShieldCheck, Key, Server, Cpu, Database, CheckCircle2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { useTranslations, useLocale } from '@/context/I18nContext';

export default function AdminAccountPage() {
  const t = useTranslations();
  const locale = useLocale();
  const isId = locale === 'id';

  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <div className="border-b border-line pb-5">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
          {isId ? '[ 08 // DOSIR KEAMANAN & AUTENTIKASI ENGINE ]' : '[ 08 // SECURITY DOSSIER & ENGINE AUTHENTICATION ]'}
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
          {isId ? 'AKUN //' : 'ACCOUNT //'} <span className="font-mono text-faint font-normal">{isId ? 'SPESIFIKASI KEAMANAN' : 'SECURITY SPEC'}</span>
        </h1>
        <p className="text-xs text-faint mt-1 font-mono">
          {isId
            ? 'Izin keamanan kriptografis, kredensial operator root, dan telemetri daemon backend.'
            : 'Cryptographic security clearance, root operator credentials, and backend daemon telemetry.'}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operator Credentials */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4">
            {isId ? '[ IZIN OPERATOR ]' : '[ OPERATOR CLEARANCE ]'}
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
              <span className="font-bold">julio.siringoringo@example.com</span>
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
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4">
            {isId ? '[ STATUS DAEMON RUST AXUM ]' : '[ RUST AXUM DAEMON STATUS ]'}
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

