import { useEffect, useState } from 'react';
import { pb as pocketbase } from '../lib/pocketbase';

const ProgressPage = () => {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const currentUser = pocketbase.authStore.model;
        setUser(currentUser);
        if (!currentUser) return;

        // Filtra por el id del usuario autenticado
        const resultList = await pocketbase.collection('mood_records').getFullList({
          filter: `user = '${currentUser.id}'`,
          sort: '-date',});
        setRecords(resultList);
        console.log('Registros obtenidos:', resultList);
      } catch (error) {
        console.error('Failed to fetch records:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRecords();
  }, []);

  if (loading) {
    return <div className="text-center mt-10">Cargando...</div>;
  }

  return (
    <div className="p-4 main-glass">
      <h1 className="text-2xl font-bold text-center mb-4">Mi Progreso</h1>
      {user && (
        <div className="mb-6 text-center">
          <div className="text-lg font-semibold">Usuario: {user.name || user.username || user.email}</div>
          <div className="text-sm text-gray-500">{user.email}</div>
        </div>
      )}
      {records.length > 0 ? (
        <div className="space-y-4">
          {records.map((record) => (
            <div
              key={record.id}
              className="bg-white bg-opacity-80 p-4 rounded-lg shadow-md text-gray-900"
            >
              <p><strong>Fecha:</strong> {new Date(record.date).toLocaleDateString()}</p>
              <p><strong>Nivel de Ánimo:</strong> {record.mood_level}</p>
              <p><strong>Emociones Positivas:</strong> {record.positive_emotions}</p>
              <p><strong>Emociones Negativas:</strong> {record.negative_emotions}</p>
              <p><strong>Calidad del Sueño:</strong> {record.sleep_quality} horas</p>
              <p><strong>Pensamientos:</strong> {record.thoughts}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500">No hay registros de ánimo todavía.</p>
      )}
    </div>
  );
};

export default ProgressPage;