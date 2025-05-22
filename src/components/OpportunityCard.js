import React from 'react';
import { formatDate } from '../utils/timeUtils';
import OpportunityTimer from './OpportunityTimer';

const OpportunityCard = ({ opportunity, onEdit }) => {
  return (
    <div className="border rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow">
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-lg font-semibold">{opportunity.name}</h3>
          <span className={`px-2 py-1 text-xs rounded-full ${
            opportunity.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
          }`}>
            {opportunity.status === 'active' ? 'Activa' : 'Entregada'}
          </span>
        </div>
        
        <div className="text-sm text-gray-600 mb-2">
          <div>Número CRM: {opportunity.crmNumber}</div>
          <div>Categoría: {opportunity.category}</div>
          <div>Recibido: {formatDate(opportunity.receptionDate)}</div>
          <div>Entrega: {formatDate(opportunity.deliveryDate)}</div>
        </div>
        
        <OpportunityTimer deliveryDate={opportunity.deliveryDate} />
        
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
        
        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={() => onEdit(opportunity)}
            className="text-sm px-3 py-1 border rounded"
          >
            Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default OpportunityCard;

// DONE