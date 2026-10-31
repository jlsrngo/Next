import { useNavigate, useLocation, useParams as useRouterParams } from 'react-router-dom'

export const useRouter = () => {
  const navigate = useNavigate()
  return {
    push: (path: string) => navigate(path),
    replace: (path: string) => navigate(path, { replace: true }),
    back: () => navigate(-1),
    forward: () => navigate(1),
    prefetch: () => {},
  }
}

export const usePathname = () => {
  const location = useLocation()
  return location.pathname
}

export const useParams = () => {
  return useRouterParams()
}
