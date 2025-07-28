import { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import MainLayout from './MainLayout'

export default function AuthLayout() {
  const { user, loading } = useAuth() // Obtener el usuario y el estado de carga de autenticación
  const navigate = useNavigate()

  // Redirigir a la página de login si no hay usuario autenticado y la carga ha terminado
  useEffect(() => {
    if (!loading && !user) {
      navigate('/login')
    }
  }, [user, loading, navigate])

  // Mostrar un mensaje de carga mientras se verifica la autenticación
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-muted-foreground">Cargando...</div>
  }

  // Renderizar el layout principal si el usuario está autenticado
  return (
    <MainLayout>
      <Outlet />
    </MainLayout>
  )
}
