export { Link } from '../lib/next-shims'
export { usePathname, useRouter } from '../lib/next-navigation-shim'
export const redirect = (to: string) => {
  if (typeof window !== 'undefined') {
    window.location.href = to
  }
}
