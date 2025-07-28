import { useState, useEffect } from 'react'
import { pb } from '../../lib/pocketbase'
import { useNavigate, useLocation } from 'react-router-dom'
import { Smile, Frown, Meh, Sun, Cloud, Zap, CheckCircle } from 'lucide-react'

// Listas de emociones predefinidas
const positiveEmotionOptions = ['Feliz', 'Agradecido', 'Contento', 'Relajado', 'Inspirado', 'Optimista', 'Entusiasmado', 'Esperanzado']
const negativeEmotionOptions = ['Triste', 'Ansioso', 'Enojado', 'Estresado', 'Cansado', 'Irritable', 'Frustrado', 'Decepcionado']

export default function MoodRecordPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const queryParams = new URLSearchParams(location.search)
  const initialMood = queryParams.get('mood')

  const [moodLevel, setMoodLevel] = useState(3) // Nivel de ánimo en escala 1-5
  const [positiveEmotions, setPositiveEmotions] = useState([]) // Cambiado a array
  const [negativeEmotions, setNegativeEmotions] = useState([]) // Cambiado a array
  const [sleepQuality, setSleepQuality] = useState(7) // Horas de sueño
  const [thoughts, setThoughts] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  // Establecer el nivel de ánimo inicial si se pasa en la URL
  useEffect(() => {
    if (initialMood === 'positive') setMoodLevel(5)
    if (initialMood === 'neutral') setMoodLevel(3)
    if (initialMood === 'negative') setMoodLevel(1)
  }, [initialMood])

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
        positive_emotions: JSON.stringify(positiveEmotions), // Convertir array a string JSON para PocketBase
        negative_emotions: JSON.stringify(negativeEmotions), // Convertir array a string JSON para PocketBase
        sleep_quality: sleepQuality,
        thoughts: thoughts,
        user: pb.authStore.model.id, // Asociar con el usuario actual
        date: new Date().toISOString(), // Fecha actual
      }

      await pb.collection('mood_records').create(data)
      setSuccess(true)
      // Limpiar formulario después de un envío exitoso
      setMoodLevel(3)
      setPositiveEmotions([]) // Limpiar array
      setNegativeEmotions([]) // Limpiar array
      setSleepQuality(7)
      setThoughts('')
      setTimeout(() => navigate('/progress'), 2000) // Redirigir después de 2 segundos
    } catch (err) {
      console.error('Error al registrar el estado de ánimo:', err)
      setError('Error al registrar el estado de ánimo. Por favor, inténtalo de nuevo.')
    }
  }

  // Función auxiliar para obtener el icono de ánimo
  const getMoodIcon = (level) => {
    if (level >= 4) return <Smile className="text-green-500" />
    if (level <= 2) return <Frown className="text-red-500" />
    return <Meh className="text-yellow-500" />
  }

  return (
    <div className="space-y-8"> {/* Contenedor principal con espaciado */}
      <header>
        <h1 className="text-3xl font-bold">Registra tu Estado de Ánimo</h1> {/* Título principal */}
        <p className="text-muted-foreground">Captura tus sentimientos y pensamientos de hoy.</p> {/* Subtítulo */}
      </header>

      <form onSubmit={handleSubmit} className="space-y-6 p-6 bg-card border rounded-lg shadow-sm"> {/* Formulario con estilos de tarjeta */}
        {success && (
          <div className="flex items-center p-4 mb-4 text-sm text-green-800 rounded-lg bg-green-50 dark:bg-gray-800 dark:text-green-400" role="alert"> {/* Mensaje de éxito */}
            <CheckCircle className="flex-shrink-0 inline w-4 h-4 me-3" />
            <span className="sr-only">Éxito</span>
            <div>
              <span className="font-medium">¡Estado de ánimo registrado con éxito!</span> Redireccionando...
            </div>
          </div>
        )}
        {error && (
          <div className="flex items-center p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400" role="alert"> {/* Mensaje de error */}
            <Zap className="flex-shrink-0 inline w-4 h-4 me-3" />
            <span className="sr-only">Error</span>
            <div>
              <span className="font-medium">Error:</span> {error}
            </div>
          </div>
        )}

        {/* Nivel de Ánimo */}
        <div>
          <label htmlFor="moodLevel" className="block text-lg font-medium text-foreground mb-2"> {/* Etiqueta de campo */}
            ¿Cómo te sientes en general? ({moodLevel}/5)
          </label>
          <div className="flex items-center gap-4"> {/* Slider de ánimo con iconos */}
            {getMoodIcon(moodLevel)}
            <input
              id="moodLevel"
              type="range"
              min="1"
              max="5"
              value={moodLevel}
              onChange={(e) => setMoodLevel(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" // Estilos de slider
            />
          </div>
        </div>

        {/* Emociones Positivas */}
        <div>
          <label className="block text-lg font-medium text-foreground mb-2"> {/* Etiqueta de campo */}
            ¿Qué emociones positivas estás experimentando?
          </label>
          <div className="flex flex-wrap gap-2"> {/* Contenedor de botones de emociones */}
            {positiveEmotionOptions.map((emotion) => (
              <button
                key={emotion}
                type="button" // Importante para evitar que el botón envíe el formulario
                onClick={() => toggleEmotion(emotion, 'positive')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${positiveEmotions.includes(emotion)
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`} // Estilos de botón de emoción
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Emociones Negativas */}
        <div>
          <label className="block text-lg font-medium text-foreground mb-2"> {/* Etiqueta de campo */}
            ¿Qué emociones negativas estás experimentando?
          </label>
          <div className="flex flex-wrap gap-2"> {/* Contenedor de botones de emociones */}
            {negativeEmotionOptions.map((emotion) => (
              <button
                key={emotion}
                type="button" // Importante para evitar que el botón envíe el formulario
                onClick={() => toggleEmotion(emotion, 'negative')}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${negativeEmotions.includes(emotion)
                  ? 'bg-red-500 text-white'
                  : 'bg-gray-200 text-gray-800 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-200 dark:hover:bg-gray-600'
                }`} // Estilos de botón de emoción
              >
                {emotion}
              </button>
            ))}
          </div>
        </div>

        {/* Calidad del Sueño */}
        <div>
          <label htmlFor="sleepQuality" className="block text-lg font-medium text-foreground mb-2"> {/* Etiqueta de campo */}
            ¿Cuántas horas dormiste anoche? ({sleepQuality} horas)
          </label>
          <div className="flex items-center gap-4"> {/* Slider de sueño con iconos */}
            <Sun className="text-yellow-500" />
            <input
              id="sleepQuality"
              type="range"
              min="0"
              max="12"
              value={sleepQuality}
              onChange={(e) => setSleepQuality(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700" // Estilos de slider
            />
            <Cloud className="text-blue-500" />
          </div>
        </div>

        {/* Pensamientos */}
        <div>
          <label htmlFor="thoughts" className="block text-lg font-medium text-foreground mb-2"> {/* Etiqueta de campo */}
            ¿Algún pensamiento o nota adicional?
          </label>
          <textarea
            id="thoughts"
            value={thoughts}
            onChange={(e) => setThoughts(e.target.value)}
            rows="4"
            className="block w-full px-3 py-2 mt-1 bg-transparent border rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" // Estilos de textarea
            placeholder="Escribe cualquier cosa que tengas en mente..."
          ></textarea>
        </div>

        <button
          type="submit"
          className="flex justify-center w-full px-4 py-2 text-lg font-medium text-primary-foreground bg-primary border border-transparent rounded-md shadow-sm hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary" // Estilos de botón primario
        >
          Registrar Estado de Ánimo
        </button>
      </form>
    </div>
  )
}
