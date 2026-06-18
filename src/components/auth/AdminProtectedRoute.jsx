import { Navigate, useLocation } from 'react-router-dom'
import useUserStore from '@/store/userStore'

/**
 * Only allows authenticated users with role === 'admin'.
 * Anyone else is redirected to /auth/login.
 */
export default function AdminProtectedRoute({ children }) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated)
  const user            = useUserStore((s) => s.user)
  const location        = useLocation()

  if (!isAuthenticated || user?.role !== 'admin') {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }
  return children
}
