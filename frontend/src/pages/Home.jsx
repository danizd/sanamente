import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Smile, Frown, Meh, Calendar, PenSquare } from 'lucide-react' // Importar iconos para mejor representación visual

// Componente de tarjeta simplificado para reutilización y consistencia visual
const InfoCard = ({ icon, title, children, className }) => (
  <div className={`bg-card p-6 rounded-lg shadow-sm ${className}`}> {/* Estilos de tarjeta modernos */}
    <div className="flex items-center gap-4 mb-4">
      {icon}
      <h2 className="text-xl font-semibold text-card-foreground">{title}</h2>
    </div>
    <div>{children}</div>
  </div>
)

export default function HomePage() {
  const { user } = useAuth()

  // Función para obtener un saludo personalizado según la hora del día
  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="space-y-8"> {/* Espaciado vertical consistente */}
      <header>
        <h1 className="text-3xl font-bold">{getGreeting()}, {user?.name || 'Usuario'}!</h1> {/* Saludo dinámico y jerarquía de título */}
        <p className="text-muted-foreground">¿Cómo te sientes hoy?</p> {/* Subtítulo con color de texto atenuado */}
      </header>

      {/* Sección de Registro Rápido de Ánimo */}
      <InfoCard
        icon={<Smile className="w-8 h-8 text-primary" />}
        title="Registro Rápido de Ánimo"
      >
        <p className="mb-4 text-muted-foreground"> {/* Descripción con espaciado */}
          Selecciona cómo te sientes ahora mismo.
        </p>
        <div className="flex justify-around gap-4"> {/* Botones de selección de ánimo con iconos */}
          <Link to="/mood/record?mood=positive" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors"> {/* Estilos de botón mejorados */}
            <Smile className="w-10 h-10 text-green-500" />
            <span className="font-medium">Positivo</span>
          </Link>
          <Link to="/mood/record?mood=neutral" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
            <Meh className="w-10 h-10 text-yellow-500" />
            <span className="font-medium">Neutral</span>
          </Link>
          <Link to="/mood/record?mood=negative" className="flex flex-col items-center gap-2 p-4 rounded-lg hover:bg-accent transition-colors">
            <Frown className="w-10 h-10 text-red-500" />
            <span className="font-medium">Negativo</span>
          </Link>
        </div>
      </InfoCard>

      <div className="grid md:grid-cols-2 gap-8"> {/* Diseño de cuadrícula para actividades */}
        {/* Sección de Progreso */}
        <InfoCard
          icon={<Calendar className="w-8 h-8 text-primary" />}
          title="Tu Progreso"
        >
          <p className="mb-4 text-muted-foreground">
            Revisa tus registros de ánimo y observa tu evolución.
          </p>
          <Link
            to="/progress"
            className="inline-flex items-center justify-center w-full px-4 py-2 font-medium text-primary-foreground bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors" // Estilos de botón primario
          >
            Ver Progreso
          </Link>
        </InfoCard>

        {/* Sección de Diario Personal */}
        <InfoCard
          icon={<PenSquare className="w-8 h-8 text-primary" />}
          title="Diario Personal"
        >
          <p className="mb-4 text-muted-foreground">
            Reflexiona sobre tu día. Escribe tus pensamientos y sentimientos.
          </p>
          <Link
            to="/mood/record"
            className="inline-flex items-center justify-center w-full px-4 py-2 font-medium text-primary-foreground bg-primary rounded-md shadow-sm hover:bg-primary/90 transition-colors"
          >
            Escribir en el Diario
          </Link>
        </InfoCard>
      </div>
    </div>
  )
}