import { changelog, type ChangelogEntry, type ChangelogStatus } from '@/lib/changelog'
import { getDashboardLocale } from '@/lib/dashboard-locale'
import { Tag, Sparkles, Bug, Zap, AlertTriangle, Clock, CheckCircle2, Calendar } from 'lucide-react'

function StatusBadge({ status, isEn }: { status: ChangelogStatus; isEn: boolean }) {
  if (status === 'released') {
    return (
      <span className="inline-flex items-center gap-1.5 rounded-none bg-emerald-50 dark:bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-700 dark:text-emerald-400">
        <CheckCircle2 size={13} />
        {isEn ? 'Released' : 'Dirilis'}
      </span>
    )
  }
  return (
    <span className="inline-flex items-center gap-1.5 rounded-none bg-blue-50 dark:bg-blue-500/10 px-3 py-1 text-xs font-semibold text-blue-700 dark:text-blue-400">
      <Clock size={13} />
      {isEn ? 'Planned' : 'Direncanakan'}
    </span>
  )
}

function ChangeIcon({ type }: { type: string }) {
  switch (type) {
    case 'feature':
      return <Sparkles size={14} className="text-emerald-500 shrink-0" />
    case 'fix':
      return <Bug size={14} className="text-red-500 shrink-0" />
    case 'improvement':
      return <Zap size={14} className="text-amber-500 shrink-0" />
    case 'breaking':
      return <AlertTriangle size={14} className="text-red-600 shrink-0" />
    default:
      return <Tag size={14} className="text-slate-400 shrink-0" />
  }
}

function ChangeTypeLabel({ type }: { type: string }) {
  const colors: Record<string, string> = {
    feature: 'text-emerald-600 dark:text-emerald-400',
    fix: 'text-red-500 dark:text-red-400',
    improvement: 'text-amber-600 dark:text-amber-400',
    breaking: 'text-red-600 dark:text-red-500',
  }
  return (
    <span className={`text-[10px] font-bold uppercase tracking-wider ${colors[type] || 'text-slate-400'}`}>
      {type}
    </span>
  )
}

export default async function ChangelogPage() {
  const locale = await getDashboardLocale()
  const isEn = locale === 'en'

  const visible = changelog.filter((e) => !e.hidden)
  const released = visible.filter((e) => e.status === 'released')
  const planned = visible.filter((e) => e.status === 'planned')

  return (
    <div className="space-y-8">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {isEn
            ? `${visible.length} release${visible.length !== 1 ? 's' : ''} \u00B7 ${released.length} released, ${planned.length} planned`
            : `${visible.length} rilis \u00B7 ${released.length} dirilis, ${planned.length} direncanakan`
          }
        </p>
      </div>

      {visible.length === 0 ? (
        <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-12 text-center">
          <Tag size={40} className="mx-auto text-slate-300 mb-3" />
          <p className="text-slate-500 dark:text-slate-400">{isEn ? 'No changelog entries yet' : 'Belum ada entri changelog'}</p>
        </div>
      ) : (
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[15px] top-0 bottom-0 w-px bg-slate-200 dark:bg-slate-700" />

          <div className="space-y-8">
            {visible.map((entry) => (
              <div key={entry.version} className="relative pl-10">
                {/* Timeline dot */}
                <div className={`absolute left-[8px] top-2 h-[15px] w-[15px] rounded-none border-[3px] ${
                  entry.status === 'released'
                    ? 'border-emerald-500 bg-white dark:bg-slate-950'
                    : 'border-blue-500 bg-white dark:bg-slate-950'
                }`} />

                <div className="rounded-none border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden">
                  {/* Header */}
                  <div className="px-5 py-4 border-b border-slate-100 dark:border-slate-800 flex flex-wrap items-center gap-3">
                    <StatusBadge status={entry.status} isEn={isEn} />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">
                      v{entry.version}
                    </span>
                    <span className="text-sm text-slate-500 dark:text-slate-400">
                      {isEn ? entry.title : entry.titleId}
                    </span>
                    {entry.date && (
                      <span className="ml-auto flex items-center gap-1 text-xs text-slate-400 dark:text-slate-500">
                        <Calendar size={12} />
                        {new Date(entry.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                      </span>
                    )}
                  </div>

                  {/* Changes */}
                  <div className="px-5 py-3">
                    <ul className="space-y-2">
                      {entry.changes.map((change, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-sm">
                          <ChangeIcon type={change.type} />
                          <div className="flex-1 min-w-0">
                            <ChangeTypeLabel type={change.type} />
                            <span className="text-slate-700 dark:text-slate-300 ml-2">
                              {isEn ? change.description : change.descriptionId}
                            </span>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
