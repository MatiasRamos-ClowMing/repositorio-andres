import React, { useState, useEffect } from 'react';

const UserManagementPanel = ({ currentUser, onBackToDashboard }) => {
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Estandar'
  });
  const [formErrors, setFormErrors] = useState({});

  // Roles disponibles
  const availableRoles = ['Administrador', 'Estandar'];

  useEffect(() => {
    // Cargar usuarios desde localStorage (simulación)
    const storedUsers = JSON.parse(localStorage.getItem('appUsers')) || [];
    // Asegurar que los usuarios por defecto estén presentes
    const defaultUsers = [
      { email: 'juan.perez@oesia.com', password: 'Password123', role: 'Administrador' },
      { email: 'maria.gonzalez@oesia.com', password: 'Password456', role: 'Estandar' },
      { email: 'acuribe@oesia.com', password: 'Oesia2025@++', role: 'Administrador' }
    ];
    const allUsers = [...new Map([...defaultUsers, ...storedUsers].map(item => [item.email, item])).values()];
    setUsers(allUsers);
    localStorage.setItem('appUsers', JSON.stringify(allUsers));
  }, []);

  const validateForm = () => {
    const errors = {};
    if (!formData.email) errors.email = 'El correo electrónico es obligatorio';
    if (!formData.password) errors.password = 'La contraseña es obligatoria';
    // Validación básica de contraseña
    if (formData.password && formData.password.length < 8) errors.password = 'La contraseña debe tener al menos 8 caracteres';
    return errors;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddUserClick = () => {
    setEditingUser(null);
    setFormData({ email: '', password: '', role: 'Estandar' });
    setFormErrors({});
    setShowForm(true);
  };

  const handleEditUserClick = (user) => {
    setEditingUser(user);
    setFormData({ email: user.email, password: user.password, role: user.role });
    setFormErrors({});
    setShowForm(true);
  };

  const handleDeleteUserClick = (userToDelete) => {
    if (currentUser.email === userToDelete.email) {
      alert('No puedes eliminar tu propio usuario.');
      return;
    }
    if (window.confirm(`¿Estás seguro de que quieres eliminar al usuario ${userToDelete.email}?`)) {
      const updatedUsers = users.filter(user => user.email !== userToDelete.email);
      setUsers(updatedUsers);
      localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    setFormErrors(errors);

    if (Object.keys(errors).length === 0) {
      if (editingUser) {
        // Modificar usuario existente
        const updatedUsers = users.map(user =>
          user.email === editingUser.email ? { ...user, ...formData } : user
        );
        setUsers(updatedUsers);
        localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
        setEditingUser(null);
      } else {
        // Agregar nuevo usuario
        if (users.some(user => user.email === formData.email)) {
          setFormErrors({ email: 'Este correo electrónico ya está registrado' });
          return;
        }
        const newUser = { ...formData };
        const updatedUsers = [...users, newUser];
        setUsers(updatedUsers);
        localStorage.setItem('appUsers', JSON.stringify(updatedUsers));
      }
      setShowForm(false);
    }
  };

  const handleCancelForm = () => {
    setShowForm(false);
    setEditingUser(null);
    setFormData({ email: '', password: '', role: 'Estandar' });
    setFormErrors({});
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6">Gestión de Usuarios</h2>

      {currentUser && currentUser.role === 'Administrador' && (
        <button
          onClick={handleAddUserClick}
          className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          + Agregar Usuario
        </button>
      )}

      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-xl font-semibold mb-4">Lista de Usuarios</h3>
        <ul className="divide-y divide-gray-200">
          {users.map(user => (
            <li key={user.email} className="py-4 flex justify-between items-center">
              <div>
                <p className="text-lg font-medium">{user.email}</p>
                <p className="text-sm text-gray-500">Rol: {user.role}</p>
              </div>
              {currentUser && currentUser.role === 'Administrador' && (
                <div className="flex space-x-2">
                  <button
                    onClick={() => handleEditUserClick(user)}
                    className="text-sm px-3 py-1 border rounded"
                  >
                    Editar
                  </button>
                  <button
                    onClick={() => handleDeleteUserClick(user)}
                    className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
                  >
                    Eliminar
                  </button>
                </div>
              )}
            </li>
          ))}
        </ul>
      </div>

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-full overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">{editingUser ? 'Editar Usuario' : 'Nuevo Usuario'}</h2>
            <form onSubmit={handleFormSubmit}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="email">
                  Correo Electrónico
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${formErrors.email ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled={!!editingUser} // No permitir cambiar email al editar
                />
                {formErrors.email && <p className="text-red-500 text-xs mt-1">{formErrors.email}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="password">
                  Contraseña
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 ${formErrors.password ? 'border-red-500' : 'border-gray-300'}`}
                  value={formData.password}
                  onChange={handleInputChange}
                />
                {formErrors.password && <p className="text-red-500 text-xs mt-1">{formErrors.password}</p>}
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1" htmlFor="role">
                  Rol
                </label>
                <select
                  id="role"
                  name="role"
                  className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.role}
                  onChange={handleInputChange}
                >
                  {availableRoles.map(role => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={handleCancelForm}
                  className="px-4 py-2 border rounded"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                >
                  Guardar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <button
        onClick={onBackToDashboard}
        className="mt-6 px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
      >
        Volver al Dashboard
      </button>
    </div>
  );
};

export default UserManagementPanel;