import React from 'react';
import { Tag, CheckCircle2, Clock } from 'lucide-react';
import CornerCrosses from '@/components/ui/CornerCrosses';
import { changelog } from '@/lib/changelog';

export default function AdminChangelogPage() {
  return (
    <div className="space-y-6 animate-fade-in text-ink">
      {/* Header HUD */}
      <div className="border-b border-line pb-5">
        <div className="font-mono text-[10px] tracking-widest uppercase font-bold text-faint mb-1">
          [ 09 // RELEASE PROTOCOLS & SYSTEM AUDIT LOG ]
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-ink uppercase">
          CHANGELOG // <span className="font-mono text-faint font-normal">VERSION LEDGER</span>
        </h1>
        <p className="text-xs text-faint mt-1 font-mono">
          Historical iteration records, kernel refactors, and architectural optimizations.
        </p>
      </div>

      <div className="space-y-6">
        {changelog.map((entry) => (
          <div key={entry.version} className="border border-line bg-bg-raised p-6 relative">
            <CornerCrosses />
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-line pb-4 mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm font-bold border border-line bg-bg px-2 py-0.5">
                    v{entry.version}
                  </span>
                  <span
                    className={`font-mono text-[9px] uppercase tracking-wider font-bold px-2 py-0.5 border ${
                      entry.status === 'released'
                        ? 'border-line bg-invert-bg text-invert-fg'
                        : 'border-line bg-bg text-faint'
                    }`}
                  >
                    {entry.status === 'released' ? 'RELEASED' : 'PLANNED'}
                  </span>
                </div>
                <h3 className="font-display text-lg font-bold text-ink mt-2">{entry.title}</h3>
              </div>

              {entry.date && (
                <div className="font-mono text-xs text-faint flex items-center gap-1.5">
                  <Clock size={13} />
                  <span>{entry.date}</span>
                </div>
              )}
            </div>

            <ul className="space-y-2 font-mono text-xs">
              {entry.changes.map((change, idx) => (
                <li key={idx} className="flex items-start gap-2.5">
                  <span
                    className={`px-1.5 py-0.5 text-[9px] uppercase font-bold border shrink-0 mt-0.5 ${
                      change.type === 'feature'
                        ? 'border-line bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'
                        : change.type === 'fix'
                        ? 'border-line bg-amber-500/10 text-amber-600 dark:text-amber-400'
                        : 'border-line bg-bg text-faint'
                    }`}
                  >
                    {change.type}
                  </span>
                  <span className="text-ink/90 font-sans text-xs leading-relaxed">
                    {change.description}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
