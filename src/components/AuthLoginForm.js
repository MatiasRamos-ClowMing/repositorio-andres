import React, { useState, useEffect } from 'react';

const AuthLoginForm = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [loginError, setLoginError] = useState('');

  // Usuarios por defecto
  const defaultUsers = [
    { email: 'juan.perez@oesia.com', password: 'Password123', role: 'Administrador' },
    { email: 'maria.gonzalez@oesia.com', password: 'Password456', role: 'Estandar' },
    { email: 'acuribe@oesia.com', password: 'Oesia2025@++', role: 'Administrador' }
  ];

  useEffect(() => {
    // Cargar email si "Recordar sesión" estaba activado
    const rememberedEmail = localStorage.getItem('userEmail');
    if (rememberedEmail) {
      setEmail(rememberedEmail);
      setRememberMe(true);
    }
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!email) newErrors.email = 'El correo electrónico es obligatorio';
    if (!password) newErrors.password = 'La contraseña es obligatoria';
    return newErrors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    setErrors(validationErrors);
    setLoginError('');

    if (Object.keys(validationErrors).length === 0) {
      // Simulación de autenticación con usuarios por defecto
      const user = defaultUsers.find(u => u.email === email && u.password === password);

      if (user) {
        console.log('Inicio de sesión exitoso para:', user.email);
        // Aquí podrías guardar el estado de la sesión (ej. en localStorage)
        if (rememberMe) {
          localStorage.setItem('rememberMe', 'true');
          localStorage.setItem('userEmail', email);
        } else {
          localStorage.removeItem('rememberMe');
          localStorage.removeItem('userEmail');
        }
        onLoginSuccess(user); // Pasa el objeto de usuario autenticado
      } else {
        // Credenciales incorrectas
        setLoginError('Correo electrónico o contraseña incorrectos');
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        {/* Logo de Oesia */}
        <div className="flex justify-center mb-6">
          <svg width="60" height="60" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7V17L12 22L22 17V7L12 2Z" fill="#811c58"/> {/* Color principal de Oesia */}
            <path d="M12 4.47214L20 9L12 13.5279L4 9L12 4.47214Z" fill="#FFFFFF"/>
            <path d="M4 9V16L12 20.5279V13.5279L4 9Z" fill="#6a1748"/> {/* Tono más oscuro */}
            <path d="M20 9V16L12 20.5279V13.5279L20 9Z" fill="#531238"/> {/* Tono aún más oscuro */}
          </svg>
        </div>

        <h2 className="text-2xl font-bold text-center mb-6" style={{ fontFamily: 'Century Gothic, sans-serif' }}>
          Gestión de Oportunidades - Preventa
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          </div>
          
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="rememberMe"
                className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
              />
              <label className="ml-2 block text-sm text-gray-900" htmlFor="rememberMe">
                Recordar sesión
              </label>
            </div>
            <a href="#" className="text-sm text-blue-600 hover:text-blue-500">
              ¿Olvidaste tu contraseña?
            </a>
          </div>
          
          {loginError && <p className="text-red-500 text-sm text-center mb-4">{loginError}</p>}
          
          <button
            type="submit"
            className="w-full py-2 px-4 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-opacity-50"
            style={{ backgroundColor: '#811c58', hover: { backgroundColor: '#6a1748' }, focus: { ringColor: '#811c58' } }}
          >
            Iniciar Sesión
          </button>
        </form>
      </div>
    </div>
  );
};

export default AuthLoginForm;

// DONE