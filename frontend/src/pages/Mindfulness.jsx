import { useState } from 'react'
import { Zap, Wind, Coffee } from 'lucide-react'

// Definición de los ejercicios de mindfulness con iconos y descripciones
const exercises = [
  {
    id: 'breathing',
    title: 'Respiración Consciente',
    description: 'Concéntrate en tu respiración para calmar tu mente.',
    duration: 5, // minutos
    icon: Wind,
  },
  {
    id: 'body-scan',
    title: 'Meditación de Escaneo Corporal',
    description: 'Dirige tu atención a diferentes partes de tu cuerpo.',
    duration: 10,
    icon: Zap,
  },
  {
    id: 'mindful-sip',
    title: 'Sorbo Consciente',
    description: 'Saborea una bebida caliente, concentrándote en los sentidos.',
    duration: 3,
    icon: Coffee,
  },
]

export default function MindfulnessPage() {
  const [selectedExercise, setSelectedExercise] = useState(null)

  // Si hay un ejercicio seleccionado, muestra el reproductor del ejercicio
  if (selectedExercise) {
    return <ExercisePlayer exercise={selectedExercise} onBack={() => setSelectedExercise(null)} />
  }

  return (
    <div className="space-y-8"> {/* Contenedor principal con espaciado */}
      <header>
        <h1 className="text-3xl font-bold">Ejercicios de Mindfulness</h1> {/* Título principal */}
        <p className="text-muted-foreground">Elige un ejercicio para comenzar tu práctica.</p> {/* Subtítulo */}
      </header>
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"> {/* Cuadrícula responsiva para los ejercicios */}
        {exercises.map((exercise) => (
          <button
            key={exercise.id}
            onClick={() => setSelectedExercise(exercise)}
            className="p-6 text-left bg-card border rounded-lg shadow-sm hover:shadow-md transition-shadow" // Estilos de tarjeta interactivos
          >
            <div className="flex items-center gap-4 mb-4"> {/* Icono y título del ejercicio */}
              <exercise.icon className="w-8 h-8 text-primary" />
              <h2 className="text-xl font-semibold text-card-foreground">{exercise.title}</h2>
            </div>
            <p className="text-muted-foreground">{exercise.description}</p> {/* Descripción del ejercicio */}
            <p className="mt-4 text-sm font-medium text-primary">{exercise.duration} min</p> {/* Duración del ejercicio */}
          </button>
        ))}
      </div>
    </div>
  )
}

// Componente para el reproductor de ejercicios de mindfulness
function ExercisePlayer({ exercise, onBack }) {
  return (
    <div className="flex flex-col items-center justify-center p-8 text-center bg-card border rounded-lg shadow-lg"> {/* Contenedor del reproductor */}
      <h2 className="text-2xl font-bold">{exercise.title}</h2> {/* Título del ejercicio seleccionado */}
      <p className="mt-2 mb-6 text-muted-foreground">Encuentra una posición cómoda y presiona reproducir.</p> {/* Instrucción */}
      <div className="flex items-center justify-center w-32 h-32 my-8 rounded-full bg-primary/10"> {/* Círculo visual para el temporizador */}
        <p className="text-4xl font-bold text-primary">{exercise.duration}:00</p>
      </div>
      <button
        onClick={onBack}
        className="w-full max-w-xs px-4 py-2 mt-6 font-medium text-white bg-primary rounded-md hover:bg-primary/90" // Botón para finalizar la sesión
      >
        Finalizar Sesión
      </button>
    </div>
  )
}
