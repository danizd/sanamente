import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function GuestLayout() {
  const { user, loading } = useAuth() // Obtener el usuario y el estado de carga de autenticación

  // Mostrar un mensaje de carga mientras se verifica la autenticación
  if (loading) {
    return <div className="flex items-center justify-center min-h-screen text-lg text-muted-foreground">Cargando...</div>
  }

  // Redirigir a la página principal si el usuario ya está autenticado
  if (user) {
    return <Navigate to="/" />
  }

  // Renderizar el contenido de la ruta anidada para invitados
  return <Outlet />
}
