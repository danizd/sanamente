import { Wind, Brain, Zap } from 'lucide-react';

const MindfulnessPage = () => {
  return (
    <div className="p-4">
      <header className="text-center mb-8">
        <h1 className="text-2xl font-bold">Mindfulness y Meditación</h1>
        <p>Encuentra tu calma interior</p>
      </header>

      <div className="mb-8">
        <div className="bg-gray-200 h-48 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <h2 className="text-2xl font-bold">Cultiva la paz interior</h2>
            <p>Ejercicios para el cuerpo y la mente</p>
          </div>
        </div>
      </div>

      <div>
        <div className="p-4 bg-white rounded-lg shadow-md mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <HeartPulse className="mr-4" />
              <div>
                <h3 className="font-bold">Respiración Consciente</h3>
                <p className="text-sm text-gray-600">Un ejercicio para calmar la mente.</p>
              </div>
            </div>
            <p>&gt;</p>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Zap className="mr-4" />
              <div>
                <h3 className="font-bold">Relajación Muscular</h3>
                <p className="text-sm text-gray-600">Libera la tensión de tu cuerpo.</p>
              </div>
            </div>
            <p>&gt;</p>
          </div>
        </div>
        <div className="p-4 bg-white rounded-lg shadow-md">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <Brain className="mr-4" />
              <div>
                <h3 className="font-bold">Restructuración Cognitiva</h3>
                <p className="text-sm text-gray-600">Cambia tus patrones de pensamiento.</p>
              </div>
            </div>
            <p>&gt;</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MindfulnessPage;
