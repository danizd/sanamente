import { Link, useLocation } from 'react-router-dom'
import { Home, BarChart, Brain, User, Moon, Sun } from 'lucide-react'
import { useAuth } from '../hooks/useAuth'
import { useState, useEffect } from 'react'

// Elementos de navegación para la barra inferior (solo visible en móvil)
const navItems = [
  { href: '/', icon: Home, label: 'Inicio' },
  { href: '/progress', icon: BarChart, label: 'Progreso' },
  // { href: '/mindfulness', icon: Brain, label: 'Mindfulness' }, // Eliminado
]

export default function MainLayout({ children }) {
  const { user, logout } = useAuth()
  const location = useLocation()
  // Estado para controlar el modo oscuro, inicializado según la preferencia del sistema o por defecto
  const [isDarkMode, setIsDarkMode] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('theme') === 'dark' || (window.matchMedia('(prefers-color-scheme: dark)').matches && !localStorage.getItem('theme'))
    }
    return true // Default to dark mode if no window object (e.g., SSR)
  })

  // Efecto para aplicar la clase 'dark' al elemento html y guardar la preferencia
  useEffect(() => {
    const root = window.document.documentElement
    root.classList.remove(isDarkMode ? 'light' : 'dark')
    root.classList.add(isDarkMode ? 'dark' : 'light')
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light')
  }, [isDarkMode])

  // Función para alternar el modo oscuro
  const toggleDarkMode = () => setIsDarkMode(!isDarkMode)

  return (
    <div className="flex flex-col min-h-screen"> {/* Contenedor principal con altura mínima */}
      <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> {/* Encabezado fijo con efecto de desenfoque */}
        <div className="container flex items-center justify-between h-16 max-w-5xl mx-auto px-4"> {/* Contenedor del encabezado */}
          <Link to="/" className="flex items-center gap-2 text-lg font-bold"> {/* Logo y nombre de la aplicación */}
            <Brain className="w-6 h-6 text-primary" />
            <span>Sanamente</span>
          </Link>
          <div className="flex items-center gap-4"> {/* Controles de usuario y tema */}
            <button onClick={toggleDarkMode} className="p-2 rounded-full hover:bg-accent"> {/* Botón para alternar modo oscuro/claro */}
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="relative group"> {/* Menú desplegable de usuario */}
              <button className="flex items-center gap-2 p-2 rounded-full hover:bg-accent"> {/* Botón de usuario */}
                <User className="w-5 h-5" />
                <span className="hidden sm:inline">{user?.name || 'Usuario'}</span>
              </button>
              <div className="absolute right-0 mt-2 w-48 bg-card border rounded-md shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200"> {/* Contenido del menú desplegable */}
                <button
                  onClick={logout}
                  className="block w-full px-4 py-2 text-left text-sm text-foreground hover:bg-accent" // Botón de cerrar sesión
                >
                  Cerrar Sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-1 w-full max-w-5xl mx-auto px-4 py-8"> {/* Contenido principal de la página */}
        {children}
      </main>

      <nav className="fixed bottom-0 left-0 right-0 md:hidden border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"> {/* Barra de navegación inferior para móviles */}
        <div className="grid h-16 grid-cols-3 max-w-full mx-auto"> {/* Contenedor de los elementos de navegación */}
          {navItems.map(({ href, icon: Icon, label }) => (
            <Link
              key={href}
              to={href}
              className={`flex flex-col items-center justify-center gap-1 text-xs font-medium ${location.pathname === href ? 'text-primary' : 'text-muted-foreground'}`} // Enlace de navegación con estilo activo
            >
              <Icon className="w-6 h-6" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </nav>

      {/* Relleno en la parte inferior para evitar que el contenido sea ocultado por la barra de navegación móvil */}
      <div className="pb-16 md:pb-0"></div>
    </div>
  )
}
