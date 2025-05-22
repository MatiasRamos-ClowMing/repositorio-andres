import React, { useState } from 'react';
import { formatDate } from '../utils/timeUtils';
import OpportunityTimerComponent from './OpportunityTimerComponent';
import { generateOpportunityPdf } from '../utils/pdfUtils';
import { updateOpportunity } from '../utils/storage';

const OpportunityCardComponent = ({ opportunity, onEdit, onDelete, currentUser }) => {
  const [showCloseOptions, setShowCloseOptions] = useState(false);

  const canEdit = currentUser && (currentUser.role === 'Administrador' || currentUser.role === 'Estandar');
  const canDelete = currentUser && currentUser.role === 'Administrador';
  const canClose = currentUser && (currentUser.role === 'Administrador' || currentUser.role === 'Estandar');

  const handleCloseClick = () => {
    setShowCloseOptions(true);
  };

  const handleOutcomeSelect = (outcome) => {
    const updatedOpportunity = {
      ...opportunity,
      status: 'closed',
      outcome: outcome,
      closedDate: new Date().toISOString() // Registrar fecha de cierre
    };
    updateOpportunity(opportunity.id, updatedOpportunity);
    setShowCloseOptions(false);
    window.dispatchEvent(new Event('storage')); // Notificar a otros componentes
  };

  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{opportunity.name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            opportunity.status === 'active' ? 'bg-green-100 text-green-800' : 
            opportunity.status === 'closed' && opportunity.outcome === 'won' ? 'bg-blue-100 text-blue-800' :
            opportunity.status === 'closed' && opportunity.outcome === 'lost' ? 'bg-red-100 text-red-800' :
            'bg-gray-100 text-gray-800'
          }`}>
            {opportunity.status === 'active' ? 'Activa' : 
             opportunity.status === 'closed' && opportunity.outcome === 'won' ? 'Ganada' :
             opportunity.status === 'closed' && opportunity.outcome === 'lost' ? 'Perdida' :
             'Cerrada'}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
          <div>Número CRM: {opportunity.crmNumber}</div>
          <div>Categoría: {opportunity.category}</div>
          <div>País: {opportunity.country}</div>
          <div>Preventa Asignado: {opportunity.assignedPreSales || 'N/A'}</div>
          <div>Recibido: {formatDate(opportunity.receptionDate)}</div>
          <div>Entrega: {formatDate(opportunity.deliveryDate)}</div>
          {opportunity.status === 'closed' && opportunity.closedDate && (
            <div>Cerrada: {formatDate(opportunity.closedDate)}</div>
          )}
        </div>
        
        {opportunity.status === 'active' && (
          <OpportunityTimerComponent deliveryDate={opportunity.deliveryDate} />
        )}
        
        {opportunity.description && (
          <div className="mt-3">
            <h4 className="text-sm font-medium mb-1">Descripción</h4>
            <p className="text-sm text-gray-600 whitespace-pre-line">
              {opportunity.description}
            </p>
          </div>
        )}
        
        {opportunity.notes.length > 0 && (
          <div className="mt-3">
            <h4 className="text-sm font-medium mb-1">Notas:</h4>
            <ul className="space-y-1">
              {opportunity.notes.map((note, index) => (
                <li key={index} className="text-sm text-gray-600">• {note}</li>
              ))}
            </ul>
          </div>
        )}
        
        <div className="flex flex-wrap justify-end gap-2 mt-4"> {/* Usar flex-wrap y gap */}
          {opportunity.status === 'active' && canEdit && (
            <button
              onClick={() => onEdit(opportunity)}
              className="text-sm px-3 py-1 border rounded flex items-center"
            >
              {/* Icono de Editar (simulado con SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="#b4147c">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              Editar
            </button>
          )}
          {canDelete && (
            <button
              onClick={() => onDelete(opportunity.id)}
              className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors flex items-center"
            >
              {/* Icono de Eliminar (simulado con SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="#FFFFFF">
                <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 011 1v6a1 1 0 11-2 0V9a1 1 0 011-1zm7 1a1 1 0 10-2 0v6a1 1 0 102 0V9z" clipRule="evenodd" />
              </svg>
              Eliminar
            </button>
          )}
          <button
            onClick={() => generateOpportunityPdf(opportunity)}
            className="text-sm px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors flex items-center"
          >
            {/* Icono de PDF (simulado con SVG) */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="#FFFFFF">
              <path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" />
            </svg>
            Exportar PDF
          </button>
          
          {opportunity.status === 'active' && canClose && !showCloseOptions && (
            <button
              onClick={handleCloseClick}
              className="text-sm px-3 py-1 bg-gray-500 text-white rounded hover:bg-gray-600 transition-colors flex items-center"
            >
              {/* Icono de Cerrar (simulado con SVG) */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="#FFFFFF">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z" clipRule="evenodd" />
              </svg>
              Cerrar Oportunidad
            </button>
          )}

          {showCloseOptions && (
            <div className="flex space-x-2">
              <button
                onClick={() => handleOutcomeSelect('won')}
                className="text-sm px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600 transition-colors"
              >
                Ganada
              </button>
              <button
                onClick={() => handleOutcomeSelect('lost')}
                className="text-sm px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
              >
                Perdida
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default OpportunityCardComponent;