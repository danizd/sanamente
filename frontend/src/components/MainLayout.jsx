import { NavLink } from 'react-router-dom';
import { Home, Sparkles, BarChart2 } from 'lucide-react';

const MainLayout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-grow">{children}</main>
      <nav className="fixed bottom-0 w-full bg-white border-t shadow-t">
        <div className="flex justify-around max-w-md mx-auto">
          <NavLink to="/" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}>
            <Home />
            <span className="text-xs">Inicio</span>
          </NavLink>
          <NavLink to="/mindfulness" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}>
            <Sparkles />
            <span className="text-xs">Mindfulness</span>
          </NavLink>
          <NavLink to="/progress" className={({ isActive }) => `flex flex-col items-center p-2 ${isActive ? 'text-blue-500' : 'text-gray-500'} hover:text-blue-500`}>
            <BarChart2 />
            <span className="text-xs">Progreso</span>
          </NavLink>
        </div>
      </nav>
    </div>
  );
};

export default MainLayout;
