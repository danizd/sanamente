import { useState, useEffect, useRef } from 'react'
import { Play, Pause, RotateCcw, Timer as TimerIcon } from 'lucide-react'

export default function MoodTimerPage() {
  const [time, setTime] = useState(0) // Tiempo en segundos
  const [isRunning, setIsRunning] = useState(false) // Estado del temporizador (corriendo/pausado)
  const timerRef = useRef(null) // Referencia para el intervalo del temporizador

  // Efecto para manejar el temporizador
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTime((prevTime) => prevTime + 1)
      }, 1000)
    } else if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    // Limpieza del intervalo al desmontar el componente o cambiar isRunning
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [isRunning])

  // Formatea el tiempo de segundos a HH:MM:SS
  const formatTime = (totalSeconds) => {
    const hours = Math.floor(totalSeconds / 3600)
    const minutes = Math.floor((totalSeconds % 3600) / 60)
    const seconds = totalSeconds % 60

    return [
      hours.toString().padStart(2, '0'),
      minutes.toString().padStart(2, '0'),
      seconds.toString().padStart(2, '0'),
    ].join(':')
  }

  // Maneja el inicio/pausa del temporizador
  const handleStartPause = () => {
    setIsRunning(!isRunning)
  }

  // Maneja el reinicio del temporizador
  const handleReset = () => {
    setIsRunning(false)
    setTime(0)
  }

  return (
    <div className="flex flex-col items-center justify-center space-y-8"> {/* Contenedor principal centrado con espaciado */}
      <header className="text-center"> {/* Encabezado de la página */}
        <h1 className="text-3xl font-bold">Temporizador de Ánimo</h1> {/* Título principal */}
        <p className="text-muted-foreground">Rastrea tus sesiones de enfoque o meditación.</p> {/* Subtítulo */}
      </header>

      <div className="relative flex items-center justify-center w-64 h-64 rounded-full bg-primary/10 shadow-xl"> {/* Círculo visual para el temporizador */}
        <TimerIcon className="absolute w-24 h-24 text-primary opacity-20" /> {/* Icono de temporizador de fondo */}
        <p className="text-5xl font-bold text-foreground z-10">{formatTime(time)}</p> {/* Tiempo formateado */}
      </div>

      <div className="flex gap-4"> {/* Contenedor de botones con espaciado */}
        <button
          onClick={handleStartPause}
          className="flex items-center gap-2 px-6 py-3 text-lg font-medium text-primary-foreground bg-primary rounded-full shadow-lg hover:bg-primary/90 transition-colors" // Estilos de botón primario
        >
          {isRunning ? <Pause className="w-6 h-6" /> : <Play className="w-6 h-6" />} {/* Icono dinámico de pausa/reproducir */}
          {isRunning ? 'Pausar' : 'Iniciar'}
        </button>
        <button
          onClick={handleReset}
          className="flex items-center gap-2 px-6 py-3 text-lg font-medium text-foreground bg-secondary rounded-full shadow-lg hover:bg-secondary/80 transition-colors" // Estilos de botón secundario
        >
          <RotateCcw className="w-6 h-6" /> {/* Icono de reinicio */}
          Restablecer
        </button>
      </div>
    </div>
  )
}
