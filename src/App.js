import React, { useState, useEffect } from 'react';
import { getOpportunities, validateOpportunityData } from './utils/storage';
import OpportunityListComponent from './components/OpportunityListComponent';
import OpportunityFormComponent from './components/OpportunityFormComponent';
import AuthLoginForm from './components/AuthLoginForm';
import UserManagementPanel from './components/UserManagementPanel';
import StatsDashboard from './components/StatsDashboard';
import LayoutNavbar from './components/LayoutNavbar'; // Importar la barra de navegación

const App = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingOpportunity, setEditingOpportunity] = useState(null);
  const [opportunities, setOpportunities] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [currentPage, setCurrentPage] = useState('dashboard'); // 'dashboard', 'users', o 'stats'

  useEffect(() => {
    const rememberedEmail = localStorage.getItem('userEmail');
    if (rememberedEmail) {
      const storedUsers = JSON.parse(localStorage.getItem('appUsers')) || [];
      const defaultUsers = [
        { email: 'juan.perez@oesia.com', password: 'Password123', role: 'Administrador' },
        { email: 'maria.gonzalez@oesia.com', password: 'Password456', role: 'Estandar' },
        { email: 'acuribe@oesia.com', password: 'Oesia2025@++', role: 'Administrador' }
      ];
      const allUsers = [...new Map([...defaultUsers, ...storedUsers].map(item => [item.email, item])).values()];
      
      const user = allUsers.find(u => u.email === rememberedEmail);
      if (user) {
        setIsAuthenticated(true);
        setCurrentUser(user);
      }
    }

    const loadOpportunities = () => {
      const loadedOpportunities = getOpportunities();
      const validatedOpportunities = validateOpportunityData(loadedOpportunities);

      if (validatedOpportunities.length === 0) {
        const initialData = require('./mock/opportunities').default;
        const validatedInitialData = validateOpportunityData(initialData);
        localStorage.setItem('opportunities', JSON.stringify(validatedInitialData));
        setOpportunities(validatedInitialData);
      } else {
        setOpportunities(validatedOpportunities);
      }
    };
    
    if (isAuthenticated && (currentPage === 'dashboard' || currentPage === 'stats')) {
      loadOpportunities();
      window.addEventListener('storage', loadOpportunities);
    }

    return () => {
      if (isAuthenticated && (currentPage === 'dashboard' || currentPage === 'stats')) {
        window.removeEventListener('storage', loadOpportunities);
      }
    };
  }, [isAuthenticated, currentPage]);

  const handleAddOpportunity = () => {
    setEditingOpportunity(null);
    setShowForm(true);
  };

  const handleEditOpportunity = (opportunity) => {
    setEditingOpportunity(opportunity);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingOpportunity(null);
    setOpportunities(getOpportunities());
  };

  const handleLoginSuccess = (user) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    if (window.confirm('¿Estás seguro de que quieres cerrar sesión?')) {
      localStorage.removeItem('rememberMe');
      localStorage.removeItem('userEmail');
      setIsAuthenticated(false);
      setCurrentUser(null);
      setCurrentPage('dashboard');
    }
  };

  const handleNavigate = (page) => {
    setCurrentPage(page);
  };

  if (!isAuthenticated) {
    return <AuthLoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <LayoutNavbar onNavigate={handleNavigate} currentUser={currentUser} onLogout={handleLogout} />
      
      <div className="max-w-7xl mx-auto p-4 md:p-8">
        {currentPage === 'dashboard' && (
          <>
            <div className="mb-6 flex justify-between items-center">
              <h2 className="text-xl font-semibold">Oportunidades</h2>
              {currentUser && (currentUser.role === 'Administrador' || currentUser.role === 'Estandar') && (
                <button
                  onClick={handleAddOpportunity}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  + Nueva Oportunidad
                </button>
              )}
            </div>
            
            <OpportunityListComponent 
              opportunities={opportunities}
              onEditOpportunity={handleEditOpportunity}
              currentUser={currentUser}
            />
          </>
        )}

        {currentPage === 'users' && currentUser && currentUser.role === 'Administrador' && (
          <UserManagementPanel 
            currentUser={currentUser} 
            onBackToDashboard={() => handleNavigate('dashboard')} 
          />
        )}

        {currentPage === 'stats' && (
           <StatsDashboard onBackToDashboard={() => handleNavigate('dashboard')} />
        )}
        
        {showForm && (
          <OpportunityFormComponent 
            opportunityToEdit={editingOpportunity}
            onClose={handleFormClose}
            onSave={handleFormClose}
          />
        )}
      </div>
    </div>
  );
};

export default App;

// DONE