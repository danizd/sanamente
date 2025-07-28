import { Link } from 'react-router-dom';
import { Pencil, Sparkles, BarChart2 } from 'lucide-react';

const HomePage = () => {
  return (
    <div className="p-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold">Miclan</h1>
        <p className="text-lg">SALUD MENTAL</p>
      </header>

      <div className="mb-8">
        <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Cuida tu salud mental</h2>
            <p>Un pequeño paso cada día</p>
          </div>
        </div>
      </div>

      <div className="mb-8">
        <Link to="/mood/timer" className="flex items-center justify-between p-4 bg-white rounded-lg shadow-md">
          <div>
            <h3 className="text-lg font-bold">¿Cómo te sientes hoy?</h3>
          </div>
          <Pencil />
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-8">
        <Link to="/mindfulness" className="flex items-center p-4 bg-white rounded-lg shadow-md">
          <Sparkles className="mr-2" />
          <h3 className="text-lg font-bold">Mindfulness</h3>
        </Link>
        <Link to="/progress" className="flex items-center p-4 bg-white rounded-lg shadow-md">
          <BarChart2 className="mr-2" />
          <h3 className="text-lg font-bold">Mi Progreso</h3>
        </Link>
      </div>

      <div>
        <div className="p-4 bg-white rounded-lg shadow-md border-l-4 border-blue-500">
          <h4 className="font-bold">Tip del día</h4>
          <p>Recuerda tomarte un momento para respirar profundamente.</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;