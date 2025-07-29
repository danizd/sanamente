import { useState, useEffect } from 'react'
import { pb } from '../../lib/pocketbase'
import { useNavigate, useLocation } from 'react-router-dom'
import { Smile, Frown, Meh, Sun, Cloud, Zap, CheckCircle } from 'lucide-react'
import { useAuth } from '../../hooks/useAuth' // Import useAuth

// Listas de emociones predefinidas
const positiveEmotionOptions = ['Feliz', 'Agradecido', 'Contento', 'Relajado', 'Inspirado', 'Optimista', 'Entusiasmado', 'Esperanzado']
const negativeEmotionOptions = ['Triste', 'Ansioso', 'Enojado', 'Estresado', 'Cansado', 'Irritable', 'Frustrado', 'Decepcionado']

export default function MoodRecordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialMood = queryParams.get('mood')
  const { user } = useAuth() // Get current user

  const [moodLevel, setMoodLevel] = useState(5) // Nivel de ánimo en escala 1-10 (default 5)
  const [positiveEmotions, setPositiveEmotions] = useState([])
  const [negativeEmotions, setNegativeEmotions] = useState([])
  const [sleepQuality, setSleepQuality] = useState(7)
  const [thoughts, setThoughts] = useState('')
  const [userCustomParameters, setUserCustomParameters] = useState([]) // State for custom parameters
  const [customParameterValues, setCustomParameterValues] = useState({}) // State for custom parameter values
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Fetch custom parameters and set initial mood level
  useEffect(() => {
    const fetchCustomParameters = async () => {
      if (user) {
        try {
          const records = await pb.collection('user_custom_parameters').getFullList({
            filter: `user = "${user.id}"`,
          })
          setUserCustomParameters(records)

          // Initialize custom parameter values
          const initialValues = {}
          records.forEach((param) => {
            initialValues[param.name] = 5 // Default value 5 for each custom parameter
          })
          setCustomParameterValues(initialValues)
        } catch (error) {
          console.error('Error fetching custom parameters:', error)
        }
      }
    }
    fetchCustomParameters()

    // Set initial mood level if passed in URL
    if (initialMood === 'positive') setMoodLevel(8)
    if (initialMood === 'neutral') setMoodLevel(5)
    if (initialMood === 'negative') setMoodLevel(2)
  }, [user, initialMood])

  // Handle change for custom parameter values
  const handleCustomParameterChange = (name, value) => {
    setCustomParameterValues((prev) => ({
      ...prev,
      [name]: parseInt(value),
    }))
  }

  // Función para alternar la selección de emociones
  const toggleEmotion = (emotion, type) => {
    if (type === 'positive') {
      setPositiveEmotions((prev) =>
        prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
      )
    } else {
      setNegativeEmotions((prev) =>
        prev.includes(emotion) ? prev.filter((e) => e !== emotion) : [...prev, emotion]
      )
    }
  }

  // Manejar el envío del formulario
  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess(false)

    try {
      const data = {
        mood_level: moodLevel,
        positive_emotions: positiveEmotions, // No need to stringify, PocketBase handles arrays
        negative_emotions: negativeEmotions, // No need to stringify, PocketBase handles arrays
        sleep_quality: sleepQuality,
        thoughts: thoughts,
        user: pb.authStore.model.id,
        date: new Date().toISOString(),
        custom_parameters_data: customParameterValues, // Add custom parameters data
      }

      await pb.collection('mood_records').create(data)
      setSuccess(true)
      // Limpiar formulario después de un envío exitoso
      setMoodLevel(5)
      setPositiveEmotions([])
      setNegativeEmotions([])
      setSleepQuality(7)
      setThoughts('')
      setCustomParameterValues({}) // Clear custom parameter values
      setTimeout(() => navigate('/progress'), 2000)
    } catch (err) {
      console.error('Error al registrar el estado de ánimo:', err)
      setError('Error al registrar el estado de ánimo. Por favor, inténtalo de nuevo.')
    }
  }

  // Función auxiliar para obtener el icono de ánimo
  const getMoodIcon = (level) => {
    if (level >= 7) return <Smile className="text-green-500" />
    if (level <= 4) return <Frown className="text-red-500" />
    return <Meh className="text-yellow-500" />
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-bold">Registra tu Estado de Ánimo</h1>
        <p className="text-muted-foreground">Captura tus sentimientos y pensamientos de hoy.</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card border rounded-lg shadow-sm">
        {success && (
          <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert">
            <CheckCircle className="flex-shrink-0 inline w-4 h-4 me-3" />
            <span className="sr-only">Éxito</span>
            <div>
              <span className="font-medium">¡Estado de ánimo registrado con éxito!</span> Redireccionando...
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert">
            <Zap className="flex-shrink-0 inline w-4 h-4 me-3" />
            <span className="sr-only">Error</span>
            <div>
              <span className="font-medium">Error:</span> {error}
            </div>
          </div>
        )}

        {/* Nivel de Ánimo */}
        <div>
          <label htmlFor="moodLevel" className="block text-lg font-medium text-foreground mb-2">
            ¿Cómo te sientes en general? ({moodLevel}/10)
          </label>
          <div className="flex items-center gap-4">
            {getMoodIcon(moodLevel)}
            <input
              id="moodLevel"
              type="range"
              min="1"
              max="10"
              value={moodLevel}
              onChange={(e) => setMoodLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
          </div>
        </div>

        {/* Custom Parameters */}
        {userCustomParameters.length > 0 && (
          <div>
            <h2 className="text-xl font-semibold text-card-foreground mb-4">Tus Parámetros Personalizados</h2>
            {userCustomParameters.map((param) => (
              <div key={param.id} className="mb-4">
                <label htmlFor={`param-${param.id}`} className="block text-lg font-medium text-foreground mb-2">
                  {param.name} ({customParameterValues[param.name] || 5}/10)
                </label>
                <input
                  id={`param-${param.id}`}
                  type="range"
                  min="1"
                  max="10"
                  value={customParameterValues[param.name] || 5}
                  onChange={(e) => handleCustomParameterChange(param.name, e.target.value)}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
                />
              </div>
            ))}
          </div>
        )}

        {/* Emociones Positivas */}
        <div>
          <label className="block text-lg font-medium text-foreground mb-2">
            ¿Qué emociones positivas estás experimentando?
          </label>
          <div className="flex flex-wrap gap-2">
            {positiveEmotionOptions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => toggleEmotion(emotion, 'positive')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${positiveEmotions.includes(emotion)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Emociones Negativas */}
        <div>
          <label className="block text-lg font-medium text-foreground mb-2">
            ¿Qué emociones negativas estás experimentando?
          </label>
          <div className="flex flex-wrap gap-2">
            {negativeEmotionOptions.map((emotion) => (
              <button
                key={emotion}
                type="button"
                onClick={() => toggleEmotion(emotion, 'negative')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${negativeEmotions.includes(emotion)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Calidad del Sueño */}
        <div>
          <label htmlFor="sleepQuality" className="block text-lg font-medium text-foreground mb-2">
            ¿Cuántas horas dormiste anoche? ({sleepQuality} horas)
          </label>
          <div className="flex items-center gap-4">
            <Sun className="text-yellow-500" />
            <input
              id="sleepQuality"
              type="range"
              min="0"
              max="12"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
            />
            <Cloud className="text-blue-500" />
          </div>
        </div>

        {/* Pensamientos */}
        <div>
          <label htmlFor="thoughts" className="block text-lg font-medium text-foreground mb-2">
            ¿Algún pensamiento o nota adicional?
          </label>
          <textarea
            id="thoughts"
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            rows="4"
            className="block w-full px-3 py-2 mt-1 bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
            placeholder="Escribe cualquier cosa que tengas en mente..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="flex justify-center w-full px-4 py-2 text-lg font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary"
        >
          Registrar Estado de Ánimo
        </button>
      </form>
    </div>
  )
}
