'use client'

import { useState, useRef, useEffect } from 'react'
import { techList } from '@/lib/techList'
import { TechIcon } from '@/components/TechIcon'

interface IconPickerProps {
  value: string
  onChange: (slug: string) => void
  error?: string
}

export default function IconPicker({ value, onChange, error }: IconPickerProps) {
  const [search, setSearch] = useState('')
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  const filtered = techList.filter(tech =>
    tech.name.toLowerCase().includes(search.toLowerCase())
  )

  const selected = techList.find(tech => tech.slug === value)

  function select(slug: string) {
    onChange(slug)
    setOpen(false)
    setSearch('')
  }

  return (
    <div ref={ref} className="relative w-full z-[100]">
      <input
        type="text"
        value={search}
        onChange={e => { setSearch(e.target.value); setOpen(true) }}
        onFocus={() => setOpen(true)}
        placeholder="Search technology..."
        className="w-full px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-none focus:ring-1 focus:ring-[var(--accent)] focus:border-transparent text-sm dark:bg-slate-800 dark:text-white"
      />

      {open && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-none z-50 max-h-64 overflow-y-auto shadow-lg">
          {filtered.length === 0 ? (
            <div className="px-4 py-3 text-slate-500 dark:text-slate-400 text-sm">
              No technology found
            </div>
          ) : (
            filtered.map(tech => (
              <div
                key={tech.slug}
                onClick={() => select(tech.slug)}
                className={`flex items-center gap-3 px-4 py-2.5 cursor-pointer transition-colors ${
                  value === tech.slug
                    ? 'bg-[var(--accent)]/10 text-[var(--accent)]'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300'
                }`}
              >
                <TechIcon name={tech.icon} size={20} color={tech.color} />
                <span className="text-sm font-medium">{tech.name}</span>
                {value === tech.slug && (
                  <span className="ml-auto text-[var(--accent)] text-sm font-bold">✓</span>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {selected && !open && (
        <div className="flex items-center gap-2 mt-2 px-3 py-2 rounded-none bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
          <TechIcon name={selected.icon} size={20} color={selected.color} />
          <span className="text-sm font-medium text-slate-700 dark:text-slate-300">{selected.name}</span>
          <button
            type="button"
            onClick={() => onChange('')}
            className="ml-auto text-slate-400 hover:text-red-500 transition-colors text-sm"
          >
            ×
          </button>
        </div>
      )}

      {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
    </div>
  )
}
