'use client'

import { useState, useEffect, useMemo } from 'react'
import { Search } from 'lucide-react'
import { toast } from 'sonner'
import { techList } from '@/lib/techList'
import { CATEGORIES, getCategoryForSlug, filterByCategory } from '@/lib/techCategories'
import { TechIcon } from '@/components/TechIcon'

export default function SkillsPage() {
  const [search, setSearch] = useState('')
  const [activeSlugs, setActiveSlugs] = useState<Set<string>>(new Set())
  const [toggling, setToggling] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/skills')
      .then(r => r.json())
      .then((skills: any[]) => {
        setActiveSlugs(new Set(skills.map((s: any) => s.iconName).filter(Boolean)))
      })
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  const filtered = useMemo(() => techList.filter(t =>
    t.name.toLowerCase().includes(search.toLowerCase())
  ), [search])

  const grouped = useMemo(() => CATEGORIES.map(cat => ({
    category: cat,
    items: filtered.filter(t => filterByCategory(t.slug, cat)),
  })).filter(g => g.items.length > 0), [filtered])

  const activeCount = activeSlugs.size

  const handleToggle = async (tech: (typeof techList)[0]) => {
    const isActive = activeSlugs.has(tech.slug)
    setToggling(tech.slug)

    try {
      if (isActive) {
        const res = await fetch(`/api/skills?iconName=${tech.slug}`)
        const skills = await res.json()
        if (skills.length > 0) {
          const delRes = await fetch(`/api/skills?id=${skills[0].id}`, { method: 'DELETE' })
          if (!delRes.ok) throw new Error('Delete failed')
        }
        setActiveSlugs(prev => {
          const next = new Set(prev)
          next.delete(tech.slug)
          return next
        })
        toast.success(`${tech.name} deactivated`)
      } else {
        const category = getCategoryForSlug(tech.slug)

        const createRes = await fetch('/api/skills', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: tech.name,
            category,
            iconName: tech.slug,
            proficiency: 80,
            featured: false,
            order: 0,
          }),
        })
        if (!createRes.ok) throw new Error('Create failed')
        setActiveSlugs(prev => new Set([...prev, tech.slug]))
        toast.success(`${tech.name} activated`)
      }
    } catch {
      toast.error('Failed to update skill')
    } finally {
      setToggling(null)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          <span className="font-semibold text-slate-900 dark:text-white">{activeCount}</span> skill{activeCount !== 1 ? 's' : ''} active
        </p>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search technologies..."
          className="w-full pl-10 pr-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-2 focus:ring-[var(--accent)] focus:border-transparent text-sm dark:bg-slate-800 dark:text-white"
        />
      </div>

      {loading ? (
        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="aspect-square rounded-none bg-slate-100 dark:bg-slate-800 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="space-y-8">
          {grouped.map(group => (
            <div key={group.category}>
              <h3 className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider mb-3">{group.category}</h3>
              <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-8 lg:grid-cols-10 gap-3">
                {group.items.map(tech => {
                  const isActive = activeSlugs.has(tech.slug)
                  const isToggling = toggling === tech.slug
                  return (
                    <button
                      key={tech.slug}
                      onClick={() => handleToggle(tech)}
                      disabled={isToggling}
                      title={tech.name}
                      className={`group relative aspect-square rounded-none border-2 flex flex-col items-center justify-center gap-1.5 transition-all duration-150 ${
                        isToggling ? 'opacity-50 scale-95' : ''
                      }`}
                      style={
                        isActive
                          ? {
                              borderColor: tech.color,
                              background: `linear-gradient(135deg, ${tech.color}dd, ${tech.color}88)`,
                              boxShadow: `0 4px 14px ${tech.color}44`,
                            }
                          : undefined
                      }
                    >
                      {!isActive && (
                        <div className="absolute inset-0 rounded-none border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                      )}

                      <div className={`relative z-10 transition-transform duration-150 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                        <div className={isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}>
                          <TechIcon name={tech.icon} size={28} />
                        </div>
                      </div>
                      <span className={`relative z-10 text-[10px] font-bold leading-tight text-center px-1 truncate w-full ${isActive ? 'text-white' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`}>
                        {tech.name}
                      </span>
                    </button>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
