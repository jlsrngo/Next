import React from 'react'
import { Link as RouterLink } from 'react-router-dom'

export const Link = React.forwardRef<HTMLAnchorElement, any>(({ href, to, children, ...props }, ref) => {
  const target = to || href || '/'
  return (
    <RouterLink ref={ref} to={target} {...props}>
      {children}
    </RouterLink>
  )
})

export default Link

export const Image = ({ src, alt, width, height, className, priority, unoptimized, fill, ...props }: any) => {
  return (
    <img
      src={src}
      alt={alt || ''}
      width={width}
      height={height}
      className={className}
      loading={priority ? 'eager' : 'lazy'}
      {...props}
    />
  )
}
