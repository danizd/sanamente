import { Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import { Smile, Frown, Meh, Calendar, PenSquare, PlusCircle, XCircle, Sparkles } from 'lucide-react'
import { useState, useEffect } from 'react'
import { pb } from '../lib/pocketbase'

const InfoCard = ({ icon, title, children, className }) => (
  <div className={`bg-white/80 dark:bg-gray-900/80 p-6 rounded-2xl shadow-xl border border-fuchsia-100 dark:border-fuchsia-900 ${className}`}>
    <div className="flex items-center gap-4 mb-4">
      {icon}
      <h2 className="text-xl font-semibold text-fuchsia-700 dark:text-fuchsia-300">{title}</h2>
    </div>
    <div>{children}</div>
  </div>
)

export default function HomePage() {
  const { user } = useAuth()
  const [userCustomParameters, setUserCustomParameters] = useState([])
  const [newCustomParameterName, setNewCustomParameterName] = useState('')
  const [showParams, setShowParams] = useState(false)

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
      setNewCustomParameterName('')
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

  const getGreeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 18) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-fuchsia-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      {/* Header moderno con enlaces */}
      <header className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-6 pt-8 pb-4 max-w-5xl mx-auto">
        <div className="flex items-center gap-3">
          <img
            src="/assets/sanamente.png"
            alt="Sanamente logo"
            className="w-12 h-12 rounded-full shadow-lg border-2 border-fuchsia-400 bg-white object-cover"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-fuchsia-700 dark:text-fuchsia-300 flex items-center gap-2">
              {getGreeting()}{user?.name ? `, ${user.name}` : ''} <Sparkles className="inline w-6 h-6 text-yellow-400" />
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-sm">Bienvenido a tu espacio de bienestar emocional</p>
          </div>
        </div>
      </header>

      {/* Hero section */}
      <section className="max-w-5xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center gap-8">
        <img
          src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80"
          alt="Bienestar emocional"
          className="w-full md:w-1/3 rounded-3xl shadow-2xl border-4 border-fuchsia-200 dark:border-fuchsia-800 object-cover"
        />
        <div className="flex-1">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-blue-700 dark:text-fuchsia-200 drop-shadow-lg">
            Sanamente: Tu diario de emociones y bienestar
          </h2>
          <p className="text-lg text-gray-700 dark:text-gray-200 mb-4">
            Registra tu estado de ánimo, emociones, calidad del sueño y pensamientos diarios. Visualiza tu progreso y descubre patrones para mejorar tu bienestar.
          </p>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-200 mb-4">
            <li>Registra cómo te sientes de forma rápida y sencilla.</li>
            <li>Personaliza los parámetros que quieres seguir cada día.</li>
            <li>Visualiza tu evolución con gráficos claros y coloridos.</li>
            <li>Accede a tu diario personal para reflexionar y crecer.</li>
          </ul>

        </div>
      </section>

      <main className="max-w-5xl mx-auto px-6 space-y-10 pb-16">
        {/* Info cards */}
        <div className="grid md:grid-cols-2 gap-8">
          <InfoCard
            icon={<Smile className="w-8 h-8 text-green-500" />}
            title="Registro Rápido de Ánimo"
          >
            <p className="mb-4 text-gray-700 dark:text-gray-200">
              Selecciona cómo te sientes ahora mismo:
            </p>
            <div className="flex justify-around gap-4">
              <Link to="/mood/record?mood=positive" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-green-100 dark:bg-green-900/40 hover:bg-green-200 dark:hover:bg-green-800 transition-colors shadow">
                <Smile className="w-10 h-10 text-green-500" />
                <span className="font-medium text-green-700 dark:text-green-200">Positivo</span>
              </Link>
              <Link to="/mood/record?mood=neutral" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-yellow-100 dark:bg-yellow-900/40 hover:bg-yellow-200 dark:hover:bg-yellow-800 transition-colors shadow">
                <Meh className="w-10 h-10 text-yellow-500" />
                <span className="font-medium text-yellow-700 dark:text-yellow-200">Neutral</span>
              </Link>
              <Link to="/mood/record?mood=negative" className="flex flex-col items-center gap-2 p-4 rounded-lg bg-red-100 dark:bg-red-900/40 hover:bg-red-200 dark:hover:bg-red-800 transition-colors shadow">
                <Frown className="w-10 h-10 text-red-500" />
                <span className="font-medium text-red-700 dark:text-red-200">Negativo</span>
              </Link>
            </div>
          </InfoCard>

          <InfoCard
            icon={<Calendar className="w-8 h-8 text-blue-500" />}
            title="Tu Progreso"
          >
            <p className="mb-4 text-gray-700 dark:text-gray-200">
              Revisa tus registros de ánimo y observa tu evolución con gráficos y estadísticas.
            </p>
            <Link
              to="/progress"
              className="inline-flex items-center justify-center w-full px-4 py-2 font-medium text-white bg-gradient-to-r from-fuchsia-500 to-blue-500 rounded-md shadow-lg hover:scale-105 transition-all"
            >
              Ver Progreso
            </Link>
          </InfoCard>
        </div>

      
        {/* Diario personal */}
        <InfoCard
          icon={<PenSquare className="w-8 h-8 text-emerald-500" />}
          title="Diario Personal"
        >
          <p className="mb-4 text-gray-700 dark:text-gray-200">
            Reflexiona sobre tu día. Escribe tus pensamientos y sentimientos para liberar tu mente y crecer emocionalmente.
          </p>
          <Link
            to="/mood/record"
            className="inline-flex items-center justify-center w-full px-4 py-2 font-medium text-white bg-gradient-to-r from-emerald-400 to-fuchsia-400 rounded-md shadow-lg hover:scale-105 transition-all"
          >
            Escribir en el Diario
          </Link>
        </InfoCard>

  {/* Parámetros personalizados */}
        <InfoCard
          icon={<PlusCircle className="w-8 h-8 text-fuchsia-500" />}
          title="Parámetros Personalizados"
        >
          <button
            className="w-full flex items-center justify-between px-4 py-3 rounded-xl bg-gradient-to-r from-blue-400 to-fuchsia-500 text-white font-semibold shadow-lg hover:scale-105 transition-all"
            onClick={() => setShowParams((v) => !v)}
          >
            <span>Añade tus parámetros personalizados</span>
            <span className="ml-2">{showParams ? '▲' : '▼'}</span>
          </button>
          {showParams && (
            <div className="mt-4 bg-white/80 dark:bg-gray-900/80 rounded-xl p-4 shadow-inner border border-fuchsia-200 dark:border-fuchsia-900">
              <p className="mb-4 text-gray-700 dark:text-gray-200">
                Añade parámetros que quieras registrar diariamente, como energía, motivación, dolor, etc.
              </p>
              <div className="mb-4">
                <h3 className="text-lg font-semibold mb-2">Sugerencias populares:</h3>
                <div className="flex flex-wrap gap-2">
                  {popularSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      onClick={() => handleAddCustomParameter(suggestion)}
                      className="px-3 py-1 border border-fuchsia-400 text-fuchsia-700 rounded-full hover:bg-fuchsia-100 hover:text-fuchsia-900 transition-colors"
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
                    className="flex-grow p-2 border border-fuchsia-300 rounded-md bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100"
                  />
                  <button
                    onClick={() => handleAddCustomParameter(newCustomParameterName)}
                    className="px-4 py-2 bg-fuchsia-500 text-white rounded-md hover:bg-fuchsia-600 transition-colors"
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
                        className="flex items-center gap-2 px-3 py-1 bg-fuchsia-100 dark:bg-fuchsia-900 text-fuchsia-700 dark:text-fuchsia-100 rounded-full"
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
            </div>
          )}
        </InfoCard>



      </main>
    </div>
  )
}