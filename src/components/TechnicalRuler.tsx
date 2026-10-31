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
      className="hidden md:flex flex-col justify-between absolute right-0 top-0 bottom-0 w-14 border-l border-black/30 dark:border-white/30 bg-bg select-none cursor-pointer py-4 z-30"
    >
      {/* Static Scale Ticks */}
      <div className="relative w-full h-full flex flex-col justify-between pointer-events-none">
        {TICKS.map((val) => (
          <div key={val} className="relative flex items-center justify-end w-full pr-1.5">
            {/* Number on Major Ticks (every 10%) */}
            {val % 10 === 0 && (
              <span className="font-mono text-[8px] text-ink font-bold pr-1.5 tracking-tight">
                {String(val).padStart(2, '0')}
              </span>
            )}
            {/* Tick Line */}
            <span
              className={`h-[1px] ${
                val % 10 === 0 ? 'w-4 bg-black dark:bg-white' : 'w-2 bg-black/40 dark:bg-white/40'
              }`}
            />
          </div>
        ))}

        {/* Dynamic Blue Active Scroll Indicator - Integrated on ruler */}
        <div
          className="absolute left-0 right-0 flex items-center justify-end pr-1.5 pointer-events-none transition-all duration-75 ease-out z-20"
          style={{ top: `${indicatorTop}%`, transform: 'translateY(-50%)' }}
        >
          {/* Active Percentage Text */}
          <span className="font-mono text-[9px] font-bold text-accent tracking-tighter mr-1 select-none bg-bg border border-accent/40 px-1 shadow-sm">
            {String(Math.round(percent)).padStart(3, '0')} %
          </span>
          {/* Active Accent Horizontal Tick Line */}
          <span className="h-[2px] w-5 bg-accent shadow-[0_0_8px_var(--accent)]" />
        </div>
      </div>
    </aside>
  )
}
