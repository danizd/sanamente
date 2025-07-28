import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { pb as pocketbase } from '../../lib/pocketbase';

const MoodRecordPage = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [mood, setMood] = useState(5);
  const [positiveEmotions, setPositiveEmotions] = useState([]);
  const [negativeEmotions, setNegativeEmotions] = useState([]);
  const [sleep, setSleep] = useState(8);
  const [thoughts, setThoughts] = useState('');

  const handleSave = async () => {
    if (!user) return;

    try {
      await pocketbase.collection('mood_records').create({
        user: user.id,
        date: new Date().toISOString(),
        mood_level: mood,
        positive_emotions: positiveEmotions,
        negative_emotions: negativeEmotions,
        sleep_quality: sleep,
        thoughts: thoughts,
      });
      navigate('/progress');
    } catch (error) {
      console.error('Failed to save mood record:', error);
    }
  };

  const toggleEmotion = (emotion, type) => {
    const emotions = type === 'positive' ? positiveEmotions : negativeEmotions;
    const setEmotions = type === 'positive' ? setPositiveEmotions : setNegativeEmotions;
    if (emotions.includes(emotion)) {
      setEmotions(emotions.filter((e) => e !== emotion));
    } else {
      setEmotions([...emotions, emotion]);
    }
  };

  return (
    <div className="p-4 max-w-md mx-auto pb-32"> {/* <-- Agrega pb-32 */}
      <h1 className="text-2xl font-bold text-center mb-8">¿Cómo te sientes?</h1>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Nivel de Ánimo</h2>
        <input
          type="range"
          min="1"
          max="10"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="text-center text-lg font-bold mt-2">{mood}</div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Emociones Positivas</h2>
        <div className="grid grid-cols-3 gap-2">
          {['Feliz', 'Agradecido', 'Contento', 'Relajado', 'Inspirado', 'Optimista'].map((emotion) => (
            <button
              key={emotion}
              onClick={() => toggleEmotion(emotion, 'positive')}
              className={`p-2 rounded-md ${positiveEmotions.includes(emotion) ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Emociones Negativas</h2>
        <div className="grid grid-cols-3 gap-2">
          {['Triste', 'Ansioso', 'Enojado', 'Estresado', 'Cansado', 'Irritable'].map((emotion) => (
            <button
              key={emotion}
              onClick={() => toggleEmotion(emotion, 'negative')}
              className={`p-2 rounded-md ${negativeEmotions.includes(emotion) ? 'bg-red-500 text-white' : 'bg-gray-200'}`}
            >
              {emotion}
            </button>
          ))}
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Calidad del Sueño (horas)</h2>
        <input
          type="range"
          min="0"
          max="12"
          value={sleep}
          onChange={(e) => setSleep(e.target.value)}
          className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer dark:bg-gray-700"
        />
        <div className="text-center text-lg font-bold mt-2">{sleep}</div>
      </div>

      <div className="mb-8">
        <h2 className="text-xl font-bold mb-4">Pensamientos</h2>
        <textarea
          value={thoughts}
          onChange={(e) => setThoughts(e.target.value)}
          className="w-full h-32 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full p-4 bg-blue-500 text-white font-bold rounded-md hover:bg-blue-600 transition-colors"
      >
        Guardar Registro
      </button>
    </div>
  );
};

export default MoodRecordPage;
