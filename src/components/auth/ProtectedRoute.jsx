import { Navigate, useLocation } from 'react-router-dom'
import useUserStore from '@/store/userStore'

/**
 * Allows authenticated users AND guest-mode users (entered via QR).
 * Anyone else is redirected to /auth/login.
 */
export default function ProtectedRoute({ children }) {
  const isAuthenticated = useUserStore((s) => s.isAuthenticated)
  const guestMode       = useUserStore((s) => s.guestMode)
  const location        = useLocation()

  if (!isAuthenticated && !guestMode) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />
  }
  return children
}
