import React from 'react';
import { ShieldCheck, Key, Server, Cpu, Database, CheckCircle2 } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';

export default function AdminAccountPage() {
  return (
    <div className="space-y-6 animate-fade-in text-ink w-full">
      {/* Header HUD */}
      <div className="border-b border-line pb-5">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
          [ 08 // SECURITY DOSSIER & ENGINE AUTHENTICATION ]
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
          ACCOUNT // <span className="font-mono text-faint font-normal">SECURITY SPEC</span>
        </h1>
        <p className="text-xs text-faint mt-1 font-mono">
          Cryptographic security clearance, root operator credentials, and backend daemon telemetry.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Operator Credentials */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4">
            [ OPERATOR CLEARANCE ]
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint">OPERATOR ROLE:</span>
              <span className="font-bold border border-line bg-bg px-2 py-0.5">ROOT ADMINISTRATOR</span>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint">ACCESS METHOD:</span>
              <span className="font-bold">SESSION SIGNATURE</span>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint">PRIMARY IDENTITY:</span>
              <span className="font-bold">julio.siringoringo@example.com</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-faint">SECURITY LEVEL:</span>
              <span className="font-bold text-emerald-500 flex items-center gap-1">
                <ShieldCheck size={14} /> FULL ACCESS
              </span>
            </div>
          </div>
        </div>

        {/* Backend Daemon Telemetry */}
        <div className="border border-line bg-bg-raised p-6 relative">
          <CornerCrosses />
          <div className="font-mono text-[10px] uppercase tracking-widest font-bold text-faint mb-4">
            [ RUST AXUM DAEMON STATUS ]
          </div>

          <div className="space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint flex items-center gap-1.5">
                <Cpu size={13} /> ENGINE:
              </span>
              <span className="font-bold">RUST AXUM 0.7 + TOKIO</span>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint flex items-center gap-1.5">
                <Database size={13} /> DATABASE:
              </span>
              <span className="font-bold">NEON POSTGRESQL (TLS)</span>
            </div>
            <div className="flex items-center justify-between border-b border-line pb-2">
              <span className="text-faint flex items-center gap-1.5">
                <Server size={13} /> PORT BINDING:
              </span>
              <span className="font-bold">127.0.0.1:8080 (PROXIED VIA 3000)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-faint">CRAWLER DAEMON:</span>
              <span className="font-bold text-emerald-500">ACTIVE (30 MIN CRON)</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

