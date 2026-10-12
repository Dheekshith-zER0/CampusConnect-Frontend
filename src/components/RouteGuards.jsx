import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth.js'
import { homePathFor } from '../utils/format.js'

// Only for logged-in users; optionally restricted to one role ("STUDENT" or "ADMIN")
export function ProtectedRoute({ role, children }) {
  const { user } = useAuth()
  const location = useLocation()

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />
  }
  if (role && user.role !== role) {
    return <Navigate to={homePathFor(user)} replace />
  }
  return children
}

// Login / register pages: logged-in users are sent to their dashboard
export function GuestRoute({ children }) {
  const { user } = useAuth()
  return user ? <Navigate to={homePathFor(user)} replace /> : children
}
