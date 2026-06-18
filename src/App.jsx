import { useEffect }           from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import ProtectedRoute      from '@/components/auth/ProtectedRoute'
import AdminProtectedRoute from '@/components/auth/AdminProtectedRoute'
import ToastProvider       from '@/components/ui/ToastProvider'
import useUserStore        from '@/store/userStore'
import useOrderStore       from '@/store/orderStore'

import RoleSelectorPage from '@/pages/RoleSelectorPage'
import QRLandingPage    from '@/pages/QRLandingPage'
import NotFoundPage     from '@/pages/NotFoundPage'
import LoginPage        from '@/pages/auth/LoginPage'
import RegisterPage     from '@/pages/auth/RegisterPage'
import CustomerLayout   from '@/components/layout/CustomerLayout'
import WorkerLayout     from '@/components/layout/WorkerLayout'
import MenuPage         from '@/pages/customer/MenuPage'
import CartPage         from '@/pages/customer/CartPage'
import CheckoutPage     from '@/pages/customer/CheckoutPage'
import TrackingPage     from '@/pages/customer/TrackingPage'
import ProfilePage      from '@/pages/customer/ProfilePage'
import DashboardPage    from '@/pages/worker/DashboardPage'

// Inner component so it can use hooks inside BrowserRouter
function AppContent() {
  const initAuth       = useUserStore((s) => s.init)
  const fetchOrders    = useOrderStore((s) => s.fetchOrders)
  const subscribeToOrders = useOrderStore((s) => s.subscribeToOrders)

  useEffect(() => {
    let cleanupAuth
    initAuth().then((cleanup) => { cleanupAuth = cleanup })

    fetchOrders()
    const cleanupRealtime = subscribeToOrders()

    return () => {
      cleanupAuth?.()
      cleanupRealtime?.()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <ToastProvider />
      <Routes>
        {/* Landing */}
        <Route path="/"   element={<RoleSelectorPage />} />
        {/* QR guest entry */}
        <Route path="/qr" element={<QRLandingPage />} />

        {/* Auth */}
        <Route path="/auth/login"    element={<LoginPage />} />
        <Route path="/auth/register" element={<RegisterPage />} />

        {/* Customer area */}
        <Route
          path="/customer"
          element={
            <ProtectedRoute>
              <CustomerLayout />
            </ProtectedRoute>
          }
        >
          <Route index            element={<Navigate to="menu" replace />} />
          <Route path="menu"      element={<MenuPage />} />
          <Route path="cart"      element={<CartPage />} />
          <Route path="checkout"  element={<CheckoutPage />} />
          <Route path="tracking"  element={<TrackingPage />} />
          <Route path="profile"   element={<ProfilePage />} />
        </Route>

        {/* Worker area */}
        <Route
          path="/worker"
          element={
            <AdminProtectedRoute>
              <WorkerLayout />
            </AdminProtectedRoute>
          }
        >
          <Route index            element={<Navigate to="dashboard" replace />} />
          <Route path="dashboard" element={<DashboardPage />} />
        </Route>

        {/* 404 */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}
