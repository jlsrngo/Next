'use client'

import { memo } from 'react'
import { loadIcon } from '@/utils/skillIconMap'

interface TechIconProps {
  name?: string
  slug?: string
  size?: number
  color?: string
}

function TechIconInner({ name, slug, size = 24, color }: TechIconProps) {
  const iconName = slug || name || ''
  const Icon = loadIcon(iconName)
  if (!Icon) return null
  return <Icon size={size} style={color ? { color } : undefined} />
}

export const TechIcon = memo(TechIconInner)
