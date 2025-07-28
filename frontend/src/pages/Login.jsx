import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { Brain } from 'lucide-react' // Importar el icono Brain

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const { login } = useAuth()
  // No se modifica la lógica de navegación, solo se usa para el flujo de autenticación

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    try {
      await login(email, password)
    } catch (err) {
      // Mensaje de error en español
      setError('Error al iniciar sesión. Por favor, verifica tus credenciales.')
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen px-4"> {/* Contenedor principal centrado */}
      <div className="w-full max-w-md p-8 space-y-8 bg-card border rounded-lg shadow-lg"> {/* Tarjeta de formulario con estilos modernos */}
        <div className="text-center"> {/* Contenedor para el logo y títulos */}
          <Brain className="w-12 h-12 mx-auto text-primary" /> {/* Icono de la aplicación */}
          <h1 className="mt-4 text-3xl font-bold text-center text-foreground">Bienvenido a Sanamente</h1> {/* Título principal */}
          <p className="mt-2 text-center text-muted-foreground">Inicia sesión para continuar tu viaje</p> {/* Subtítulo */}
        </div>
        <form onSubmit={handleSubmit} className="space-y-6"> {/* Formulario con espaciado mejorado */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-foreground"> {/* Etiqueta de campo */}
              Correo Electrónico
            </label>
            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="block w-full px-3 py-2 mt-1 bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" // Estilos de input modernos
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-foreground"> {/* Etiqueta de campo */}
              Contraseña
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="block w-full px-3 py-2 mt-1 bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" // Estilos de input modernos
            />
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>} {/* Mensaje de error */}
          <div>
            <button
              type="submit"
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" // Estilos de botón modernos
            >
              Iniciar Sesión
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
