import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import MainLayout from './MainLayout'

const AuthLayout = () => {
  const { user } = useAuth()

  if (!user) {
    return <Navigate to="/login" />
  }

  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}

export default AuthLayout
