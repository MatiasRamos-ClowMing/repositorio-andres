import React from 'react';

const LayoutNavbar = ({ onNavigate, currentUser, onLogout }) => {
  return (
    <nav className="bg-gray-800 p-4 text-white shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          {/* Logo de Oesia (reutilizado del App.js) */}
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#b4147c"/> {/* Primario */}
            <path d="M12 4.47214L20 9L12 13.5279L4 9L12 4.47214Z" fill="#FFFFFF"/>
            <path d="M4 9V16L12 20.5279V13.5279L4 9Z" fill="#811c58"/> {/* Secundario */}
            <path d="M20 9V16L12 20.5279V13.5279L20 9Z" fill="#94185c"/> {/* Terciario */}
          </svg>
          <span className="text-xl font-bold" style={{ fontFamily: 'Century Gothic, sans-serif' }}>OESIA</span>
        </div>

        <div className="flex items-center space-x-4">
          <button
            onClick={() => onNavigate('dashboard')}
            className="px-3 py-2 rounded hover:bg-gray-700 transition-colors"
          >
            Inicio
          </button>
          {currentUser && (currentUser.role === 'Administrador' || currentUser.role === 'Estandar') && (
            <button
              onClick={() => onNavigate('stats')}
              className="px-3 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Estadísticas
            </button>
          )}
          {currentUser && currentUser.role === 'Administrador' && (
            <button
              onClick={() => onNavigate('users')}
              className="px-3 py-2 rounded hover:bg-gray-700 transition-colors"
            >
              Gestión de Usuarios
            </button>
          )}
        </div>

        <div>
          <button
            onClick={onLogout}
            className="px-3 py-2 bg-red-500 rounded hover:bg-red-600 transition-colors"
          >
            Cerrar Sesión
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LayoutNavbar;