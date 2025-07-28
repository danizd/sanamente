import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const MoodTimerPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigate('/mood/record');
    }, 3000); // 3 second delay

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-2xl font-bold mb-4">Tómate un momento para respirar</h1>
      <p className="text-lg">Prepárate para registrar tu estado de ánimo.</p>
    </div>
  );
};

export default MoodTimerPage;
