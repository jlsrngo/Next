'use client'

import React, { useEffect, useState, useCallback, useRef } from 'react'

interface TechnicalRulerProps {
  scrollContainerRef: React.RefObject<HTMLElement>
}

// 21 major tick marks: 00, 05, 10, ..., 95, 100
const TICKS = Array.from({ length: 21 }, (_, i) => i * 5)

export default function TechnicalRuler({ scrollContainerRef }: TechnicalRulerProps) {
  const [percent, setPercent] = useState(0)
  const rulerRef = useRef<HTMLDivElement>(null)

  const updateScroll = useCallback(() => {
    const el = scrollContainerRef.current
    if (!el) return
    const max = el.scrollHeight - el.clientHeight
    if (max <= 0) {
      setPercent(0)
      return
    }
    const current = Math.min(Math.max((el.scrollTop / max) * 100, 0), 100)
    setPercent(current)
  }, [scrollContainerRef])

  useEffect(() => {
    const el = scrollContainerRef.current
    if (!el) return

    el.addEventListener('scroll', updateScroll, { passive: true })
    window.addEventListener('resize', updateScroll)
    updateScroll()

    return () => {
      el.removeEventListener('scroll', updateScroll)
      window.removeEventListener('resize', updateScroll)
    }
  }, [scrollContainerRef, updateScroll])

  const handleRulerClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = scrollContainerRef.current
    const ruler = rulerRef.current
    if (!el || !ruler) return

    const rect = ruler.getBoundingClientRect()
    const clickY = e.clientY - rect.top
    const ratio = Math.min(Math.max(clickY / rect.height, 0), 1)
    const max = el.scrollHeight - el.clientHeight
    el.scrollTo({ top: ratio * max, behavior: 'smooth' })
  }

  // Clamped indicator position between 1.5% and 98.5%
  const indicatorTop = Math.min(Math.max(percent, 1.5), 98.5)

  return (
    <aside
      ref={rulerRef}
      onClick={handleRulerClick}
      aria-label="Technical Scroll Ruler"
      className="hidden md:flex flex-col justify-between absolute right-0 top-0 bottom-0 w-12 xl:w-14 border-l border-line bg-bg/50 backdrop-blur-[2px] z-30 select-none cursor-pointer py-4"
    >
      {/* Background Vertical Watermark (Rotated) */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 dark:opacity-25 overflow-hidden">
        <span
          className="font-mono text-[9px] uppercase tracking-[0.35em] font-bold text-ink whitespace-nowrap rotate-90"
          style={{ letterSpacing: '0.4em' }}
        >
          ARTCRAFT // 2026
        </span>
      </div>

      {/* Static Scale Ticks */}
      <div className="relative w-full h-full flex flex-col justify-between pointer-events-none">
        {TICKS.map((val) => (
          <div key={val} className="relative flex items-center justify-end w-full pr-1.5">
            {/* Number on Major Ticks (every 10%) */}
            {val % 10 === 0 && (
              <span className="font-mono text-[8px] text-faint pr-1 tracking-tight font-bold">
                {String(val).padStart(2, '0')}
              </span>
            )}
            {/* Tick Line */}
            <span
              className={`h-[1px] ${
                val % 10 === 0 ? 'w-3.5 bg-line-strong' : 'w-2 bg-line'
              }`}
            />
          </div>
        ))}

        {/* Dynamic Blue Active Scroll Indicator */}
        <div
          className="absolute left-0 right-0 flex items-center pointer-events-none transition-all duration-75 ease-out z-20"
          style={{ top: `${indicatorTop}%`, transform: 'translateY(-50%)' }}
        >
          {/* Active Accent Horizontal Line */}
          <div className="h-[2px] w-full bg-[var(--accent)] shadow-[0_0_8px_var(--accent)]" />

          {/* Active Percentage Badge (Floating Left from Ruler) */}
          <div className="absolute right-full mr-2 flex items-center gap-1 bg-bg-raised border border-[var(--accent)] px-1.5 py-0.5 shadow-md">
            <span className="w-1.5 h-1.5 bg-[var(--accent)] animate-pulse" />
            <span className="font-mono text-[9px] font-bold text-[var(--accent)] tracking-wider whitespace-nowrap">
              {String(Math.round(percent)).padStart(3, '0')} %
            </span>
          </div>
        </div>
      </div>
    </aside>
  )
}
