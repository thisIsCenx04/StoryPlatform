import { Navigate, Outlet } from 'react-router-dom'

import { apiConfig } from '../config/apiConfig'
import { useAuth } from '../hooks/useAuth'

const AdminRoute = () => {
  const { isAuthenticated, user } = useAuth()
  if (!isAuthenticated || user?.role !== 'ADMIN') {
    return <Navigate to={apiConfig.adminLoginPagePath} replace />
  }
  return <Outlet />
}

export default AdminRoute
