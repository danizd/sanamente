import { useEffect, useState } from 'react'
import { pb as pocketbase } from '../lib/pocketbase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Smile, Moon, ListTodo } from 'lucide-react' // Importar iconos para los bloques de resumen

// Componente de tarjeta de resumen
const SummaryCard = ({ icon, title, value }) => (
  <div className="bg-card p-6 rounded-lg shadow-md dark:shadow-[0_8px_32px_0_rgba(112,112,112,0.65)] text-center flex flex-col items-center justify-center">
    <div className="text-primary mb-2">{icon}</div>
    <h3 className="text-lg font-semibold text-card-foreground mb-1">{title}</h3>
    <p className="text-3xl font-bold">{value}</p>
  </div>
)

const ProgressPage = () => {
  const [records, setRecords] = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [chartData, setChartData] = useState([])
  const [customParameterNames, setCustomParameterNames] = useState([])
  const [averageMood, setAverageMood] = useState(0)
  const [averageSleep, setAverageSleep] = useState(0)
  const [totalRecords, setTotalRecords] = useState(0)

  useEffect(() => {
    const fetchRecordsAndParams = async () => {
      try {
        const currentUser = pocketbase.authStore.model
        setUser(currentUser)
        if (!currentUser) return

        const resultList = await pocketbase.collection('mood_records').getFullList({
          filter: `user = '${currentUser.id}'`,
          sort: '-date', // <-- Cambia aquí, el guion indica descendente
        })
        setRecords(resultList)

        const customParams = await pocketbase.collection('user_custom_parameters').getFullList({
          filter: `user = "${currentUser.id}"`,
        })
        setCustomParameterNames(customParams.map(p => p.name))

        // Calculate summary metrics
        if (resultList.length > 0) {
          const totalMood = resultList.reduce((sum, record) => sum + record.mood_level, 0)
          setAverageMood((totalMood / resultList.length).toFixed(1))

          const totalSleep = resultList.reduce((sum, record) => sum + record.sleep_quality, 0)
          setAverageSleep((totalSleep / resultList.length).toFixed(1))

          setTotalRecords(resultList.length)
        } else {
          setAverageMood(0)
          setAverageSleep(0)
          setTotalRecords(0)
        }

        // Process data for charts
        const processedData = resultList.map(record => {
          const dataPoint = {
            date: new Date(record.date).toLocaleDateString(),
            mood_level: record.mood_level,
            sleep_quality: record.sleep_quality,
          }
          // Add custom parameters data
          if (record.custom_parameters_data) {
            for (const paramName of customParams.map(p => p.name)) {
              dataPoint[paramName] = record.custom_parameters_data[paramName] || null
            }
          }
          return dataPoint
        })
        setChartData(processedData.slice().reverse()) // <-- Invierte el orden solo para los gráficos

      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecordsAndParams()
  }, [])

  if (loading) {
    return <div className="text-center mt-10">Cargando...</div>
  }

  return (
    <div className="p-4 main-glass">
      <h1 className="text-3xl font-bold mb-6">Mi Progreso</h1>

      {records.length === 0 ? (
        <p className="text-center text-muted-foreground text-lg">No hay registros de ánimo todavía para mostrar el progreso.</p>
      ) : (
        <div className="space-y-10">
          {/* Summary Blocks */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <SummaryCard icon={<Smile size={36} />} title="Ánimo Promedio" value={averageMood} />
            <SummaryCard icon={<Moon size={36} />} title="Sueño Promedio (horas)" value={averageSleep} />
            <SummaryCard icon={<ListTodo size={36} />} title="Total de Registros" value={totalRecords} />
          </div>

          {/* Mood Level Chart */}
          <div className="bg-card p-6 rounded-lg shadow-md dark:shadow-[0_8px_32px_0_rgba(112,112,112,0.65)]">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Nivel de Ánimo General</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis domain={[1, 10]} stroke="#666" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="mood_level" stroke="#8884d8" activeDot={{ r: 8 }} name="Nivel de Ánimo" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Sleep Quality Chart */}
          <div className="bg-card p-6 rounded-lg shadow-md dark:shadow-[0_8px_32px_0_rgba(112,112,112,0.65)]">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Calidad del Sueño (horas)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                <XAxis dataKey="date" stroke="#666" />
                <YAxis domain={[0, 12]} stroke="#666" />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="sleep_quality" stroke="#82ca9d" activeDot={{ r: 8 }} name="Horas de Sueño" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Custom Parameters Charts */}
          {customParameterNames.map(paramName => (
            <div key={paramName} className="bg-card p-6 rounded-lg shadow-md dark:shadow-[0_8px_32px_0_rgba(112,112,112,0.65)]">
              <h2 className="text-2xl font-semibold mb-4 text-card-foreground">{paramName}</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#666" />
                  <YAxis domain={[1, 10]} stroke="#666" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey={paramName} stroke="#ffc658" activeDot={{ r: 8 }} name={paramName} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          ))}

          {/* Raw Records Display */}
          <div className="bg-card p-6 rounded-lg shadow-md dark:shadow-[0_8px_32px_0_rgba(112,112,112,0.65)]">
            <h2 className="text-2xl font-semibold mb-4 text-card-foreground">Registros Detallados</h2>
            <div className="space-y-4">
              {records.map((record) => (
                <div
                  key={record.id}
                  className="bg-background p-4 rounded-lg shadow-sm text-foreground border border-border"
                >
                  <p><strong>Fecha:</strong> {new Date(record.date).toLocaleDateString()}</p>
                  <p><strong>Nivel de Ánimo:</strong> {record.mood_level}/10</p>
                  <p><strong>Emociones Positivas:</strong> {Array.isArray(record.positive_emotions) && record.positive_emotions.length > 0 ? record.positive_emotions.join(', ') : 'Ninguna'}</p>
                  <p><strong>Emociones Negativas:</strong> {Array.isArray(record.negative_emotions) && record.negative_emotions.length > 0 ? record.negative_emotions.join(', ') : 'Ninguna'}</p>
                  <p><strong>Calidad del Sueño:</strong> {record.sleep_quality} horas</p>
                  <p><strong>Pensamientos:</strong> {record.thoughts || 'Ninguno'}</p>

                  {record.custom_parameters_data && Object.keys(record.custom_parameters_data).length > 0 && (
                    <div className="mt-2">
                      <p><strong>Parámetros Personalizados:</strong></p>
                      <ul className="list-disc list-inside ml-4">
                        {Object.entries(record.custom_parameters_data).map(([paramName, paramValue]) => (
                          <li key={paramName}>{paramName}: {paramValue}/10</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default ProgressPage;