import React, { useState } from 'react';
import { addOpportunity, updateOpportunity } from '../utils/storage';
import { formatDate } from '../utils/timeUtils';

const OpportunityFormComponent = ({ opportunityToEdit, onClose, onSave }) => {
  const [formData, setFormData] = useState(opportunityToEdit || {
    name: '',
    description: '',
    crmNumber: '',
    receptionDate: new Date().toISOString().slice(0, 16),
    deliveryDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
    category: 'Gestión',
    country: 'Colombia',
    assignedPreSales: 'Carolina Tovar Catiblanco',
    notes: [],
    status: 'active'
  });

  const [newNote, setNewNote] = useState('');

  const preSalesOptions = ['Carolina Tovar Catiblanco', 'Andres Camilo Uribe'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleAddNote = () => {
    if (newNote.trim()) {
      const timestamp = new Date().toLocaleString();
      setFormData({
        ...formData,
        notes: [...formData.notes, `${timestamp}: ${newNote}`]
      });
      setNewNote('');
    }
  };

  const handleRemoveNote = (index) => {
    const updatedNotes = formData.notes.filter((_, i) => i !== index);
    setFormData({ ...formData, notes: updatedNotes });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const opportunity = {
      ...formData,
      id: opportunityToEdit ? opportunityToEdit.id : Date.now()
    };

    if (opportunityToEdit) {
      updateOpportunity(opportunity.id, opportunity);
    } else {
      addOpportunity(opportunity);
    }

    onSave();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-full overflow-y-auto">
        <h2 className="text-xl font-bold mb-4">
          {opportunityToEdit ? 'Editar Oportunidad' : 'Nueva Oportunidad'}
        </h2>
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Nombre</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Número CRM</label>
              <input
                type="text"
                name="crmNumber"
                value={formData.crmNumber}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Recepción</label>
              <input
                type="datetime-local"
                name="receptionDate"
                value={formData.receptionDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Fecha Entrega</label>
              <input
                type="datetime-local"
                name="deliveryDate"
                value={formData.deliveryDate}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Categoría</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Gestión">Gestión</option>
                <option value="Desarrollo">Desarrollo</option>
                <option value="Infraestructura">Infraestructura</option>
                <option value="Seguridad">Seguridad</option>
                <option value="Otros">Otros</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">País</label>
              <select
                name="country"
                value={formData.country}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                <option value="Colombia">Colombia</option>
                <option value="Perú">Perú</option>
                <option value="España">España</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Preventa Asignado</label>
              <select
                name="assignedPreSales"
                value={formData.assignedPreSales}
                onChange={handleChange}
                className="w-full p-2 border rounded"
              >
                {preSalesOptions.map(option => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Descripción</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded h-24"
                placeholder="Resumen del trabajo a realizar"
              />
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium mb-1">Notas</label>
            <div className="flex mb-2">
              <input
                type="text"
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="flex-1 p-2 border rounded-l"
                placeholder="Agregar nota"
              />
              <button
                type="button"
                onClick={handleAddNote}
                className="bg-blue-500 text-white px-4 rounded-r"
              >
                +
              </button>
            </div>
            
            <div className="space-y-2">
              {formData.notes.map((note, index) => (
                <div key={index} className="flex items-center justify-between bg-gray-100 p-2 rounded">
                  <span className="text-sm text-gray-700">{note}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveNote(index)}
                    className="text-red-500"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityFormComponent;