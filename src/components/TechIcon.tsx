'use client'

import { memo } from 'react'
import { loadIcon } from '@/utils/skillIconMap'

interface TechIconProps {
  name?: string
  slug?: string
  icon?: string
  size?: number
  color?: string
  className?: string
}

function TechIconInner({ name, slug, icon, size = 24, color, className }: TechIconProps) {
  // Try icon (e.g. FaHtml5), then slug (e.g. html5), then name (e.g. HTML5)
  const Icon = (icon && loadIcon(icon)) || (slug && loadIcon(slug)) || (name && loadIcon(name))
  if (!Icon) return null
  return <Icon size={size} className={className} style={color ? { color } : undefined} />
}

export const TechIcon = memo(TechIconInner)
