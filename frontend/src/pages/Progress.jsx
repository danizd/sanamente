import { useEffect, useState } from 'react'
import { pb as pocketbase } from '../lib/pocketbase'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import { Smile, Moon, ListTodo } from 'lucide-react'

const SummaryCard = ({ icon, title, value, color }) => (
  <div className={`p-6 rounded-2xl shadow-lg bg-gradient-to-br ${color} text-white flex flex-col items-center justify-center transition-all duration-300`}>
    <div className="mb-2">{icon}</div>
    <h3 className="text-lg font-semibold mb-1 drop-shadow">{title}</h3>
    <p className="text-3xl font-bold drop-shadow">{value}</p>
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
          sort: '-date',
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
          if (record.custom_parameters_data) {
            for (const paramName of customParams.map(p => p.name)) {
              dataPoint[paramName] = record.custom_parameters_data[paramName] || null
            }
          }
          return dataPoint
        })
        setChartData(processedData.slice().reverse())
      } catch (error) {
        console.error('Failed to fetch data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchRecordsAndParams()
  }, [])

  if (loading) {
    return <div className="text-center mt-10 text-blue-600 font-bold animate-pulse">Cargando...</div>
  }

  return (
    <div className="p-4 min-h-screen bg-gradient-to-br from-blue-50 via-fuchsia-50 to-pink-100 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-colors">
      <div className="main-glass max-w-4xl mx-auto rounded-3xl shadow-2xl p-6 md:p-10">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-fuchsia-700 dark:text-fuchsia-300 drop-shadow-lg">Mi Progreso</h1>

        {records.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No hay registros de ánimo todavía para mostrar el progreso.</p>
        ) : (
          <div className="space-y-10">
            {/* Summary Blocks */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <SummaryCard icon={<Smile size={36} />} title="Ánimo Promedio" value={averageMood} color="from-blue-400 to-blue-600" />
              <SummaryCard icon={<Moon size={36} />} title="Sueño Promedio (horas)" value={averageSleep} color="from-fuchsia-400 to-pink-500" />
              <SummaryCard icon={<ListTodo size={36} />} title="Total de Registros" value={totalRecords} color="from-emerald-400 to-emerald-600" />
            </div>

            {/* Mood Level Chart */}
            <div className="bg-white/80 dark:bg-gray-900/80 border border-blue-200 dark:border-fuchsia-900 rounded-2xl shadow-xl p-6 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-blue-700 dark:text-fuchsia-300">Nivel de Ánimo General</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#6366f1" />
                  <YAxis domain={[1, 10]} stroke="#6366f1" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="mood_level" stroke="#a21caf" strokeWidth={3} activeDot={{ r: 8 }} name="Nivel de Ánimo" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Sleep Quality Chart */}
            <div className="bg-white/80 dark:bg-gray-900/80 border border-emerald-200 dark:border-emerald-900 rounded-2xl shadow-xl p-6 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-emerald-700 dark:text-emerald-300">Calidad del Sueño (horas)</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={chartData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                  <XAxis dataKey="date" stroke="#10b981" />
                  <YAxis domain={[0, 12]} stroke="#10b981" />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="sleep_quality" stroke="#10b981" strokeWidth={3} activeDot={{ r: 8 }} name="Horas de Sueño" />
                </LineChart>
              </ResponsiveContainer>
            </div>

            {/* Custom Parameters Charts */}
            {customParameterNames.map(paramName => (
              <div key={paramName} className="bg-white/80 dark:bg-gray-900/80 border border-yellow-200 dark:border-yellow-900 rounded-2xl shadow-xl p-6 transition-all duration-300">
                <h2 className="text-2xl font-bold mb-4 text-yellow-700 dark:text-yellow-300">{paramName}</h2>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={chartData}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                    <XAxis dataKey="date" stroke="#eab308" />
                    <YAxis domain={[1, 10]} stroke="#eab308" />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey={paramName} stroke="#eab308" strokeWidth={3} activeDot={{ r: 8 }} name={paramName} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            ))}

            {/* Raw Records Display */}
            <div className="bg-white/90 dark:bg-gray-900/90 border border-fuchsia-200 dark:border-fuchsia-900 rounded-2xl shadow-xl p-6 transition-all duration-300">
              <h2 className="text-2xl font-bold mb-4 text-fuchsia-700 dark:text-fuchsia-300">Registros Detallados</h2>
              <div className="space-y-4">
                {records.map((record) => (
                  <div
                    key={record.id}
                    className="bg-gradient-to-br from-blue-100 via-fuchsia-100 to-pink-100 dark:from-gray-800 dark:via-gray-900 dark:to-gray-800 p-4 rounded-xl shadow-md dark:shadow-lg text-gray-900 dark:text-gray-100 border border-blue-200 dark:border-fuchsia-900"
                  >
                    <p><strong>Fecha:</strong> {new Date(record.date).toLocaleDateString()}</p>
                    <p><strong>Nivel de Ánimo:</strong> {record.mood_level}/10</p>
                    <p><strong>Emociones Positivas:</strong> {Array.isArray(record.positive_emotions) && record.positive_emotions.length > 0 ? record.positive_emotions.join(', ') : record.positive_emotions || 'Ninguna'}</p>
                    <p><strong>Emociones Negativas:</strong> {Array.isArray(record.negative_emotions) && record.negative_emotions.length > 0 ? record.negative_emotions.join(', ') : record.negative_emotions || 'Ninguna'}</p>
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
    </div>
  )
}

export default ProgressPage