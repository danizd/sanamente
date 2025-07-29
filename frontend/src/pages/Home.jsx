import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Smile, Frown, Meh, Calendar, PenSquare, PlusCircle, XCircle } from 'lucide-react' // Importar iconos para mejor representación visual
import { useState, useEffect } from 'react'
import { pb } from '../lib/pocketbase'

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
  const [userCustomParameters, setUserCustomParameters] = useState([])
  const [newCustomParameterName, setNewCustomParameterName] = useState('')

  const popularSuggestions = [
    'Dolor de cabeza',
    'Mareos',
    'Dolor de espalda',
    'Ansiedad',
    'Estado de ánimo',
    'Concentración',
    'Apetito',
    'Ejercicio físico',
  ]

  useEffect(() => {
    const fetchCustomParameters = async () => {
      if (user) {
        try {
          const records = await pb.collection('user_custom_parameters').getFullList({
            filter: `user = "${user.id}"`,
          })
          setUserCustomParameters(records)
        } catch (error) {
          console.error('Error fetching custom parameters:', error)
        }
      }
    }
    fetchCustomParameters()
  }, [user])

  const handleAddCustomParameter = async (name) => {
    if (!user || !name) return
    try {
      const newRecord = await pb.collection('user_custom_parameters').create({
        user: user.id,
        name: name,
      })
      setUserCustomParameters((prev) => [...prev, newRecord])
      setNewCustomParameterName('') // Clear input after adding
    } catch (error) {
      console.error('Error adding custom parameter:', error)
      alert('Error al añadir el parámetro. Asegúrate de que no exista ya.')
    }
  }

  const handleRemoveCustomParameter = async (id) => {
    if (!user) return
    try {
      await pb.collection('user_custom_parameters').delete(id)
      setUserCustomParameters((prev) => prev.filter((param) => param.id !== id))
    } catch (error) {
      console.error('Error removing custom parameter:', error)
      alert('Error al eliminar el parámetro.')
    }
  }

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

      {/* Sección de Parámetros Personalizados */}
      <InfoCard
        icon={<PlusCircle className="w-8 h-8 text-primary" />}
        title="Añade tus parámetros personalizados"
      >
        <p className="mb-4 text-muted-foreground">
          Añade parámetros que quieras registrar diariamente.
        </p>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Sugerencias populares:</h3>
          <div className="flex flex-wrap gap-2">
            {popularSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                onClick={() => handleAddCustomParameter(suggestion)}
                className="px-3 py-1 border border-primary text-primary rounded-full hover:bg-primary hover:text-primary-foreground transition-colors"
              >
                + {suggestion}
              </button>
            ))}
          </div>
        </div>
        <div className="mb-4">
          <h3 className="text-lg font-semibold mb-2">Añade el tuyo propio:</h3>
          <div className="flex gap-2">
            <input
              type="text"
              value={newCustomParameterName}
              onChange={(e) => setNewCustomParameterName(e.target.value)}
              placeholder="Ej. Nivel de energía"
              className="flex-grow p-2 border border-input rounded-md bg-background text-foreground"
            />
            <button
              onClick={() => handleAddCustomParameter(newCustomParameterName)}
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
            >
              Añadir
            </button>
          </div>
        </div>

        {userCustomParameters.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-2">Tus parámetros:</h3>
            <div className="flex flex-wrap gap-2">
              {userCustomParameters.map((param) => (
                <div
                  key={param.id}
                  className="flex items-center gap-2 px-3 py-1 bg-secondary text-secondary-foreground rounded-full"
                >
                  <span>{param.name}</span>
                  <button
                    onClick={() => handleRemoveCustomParameter(param.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    <XCircle className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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