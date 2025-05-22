import React from 'react';

const DashboardStatsPanel = ({ opportunities }) => {
  const totalOpen = opportunities.filter(op => op.status === 'active').length;
  const totalDelivered = opportunities.filter(op => op.status === 'delivered').length;
  const totalOpportunities = opportunities.length;

  // Simulación de oportunidades ganadas y perdidas (basado en estado 'delivered')
  // En una aplicación real, necesitarías un campo específico para esto
  const wonOpportunities = totalDelivered; // Simulación: todas las entregadas son "ganadas"
  const lostOpportunities = 0; // Simulación: no hay estado "perdida"

  const conversionRate = totalOpportunities > 0 ? (wonOpportunities / totalOpportunities) * 100 : 0;

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
      <h3 className="text-xl font-semibold mb-4" style={{ color: '#811c58' }}>Estadísticas de Oportunidades</h3>
      <div className="space-y-4">
        <div>
          <p className="text-gray-700">Oportunidades Abiertas:</p>
          <p className="text-2xl font-bold" style={{ color: '#007BFF' }}>{totalOpen}</p>
        </div>
        <div>
          <p className="text-gray-700">Oportunidades Ganadas (Simulado):</p>
          <p className="text-2xl font-bold" style={{ color: '#28A745' }}>{wonOpportunities}</p>
        </div>
        <div>
          <p className="text-gray-700">Oportunidades Perdidas (Simulado):</p>
          <p className="text-2xl font-bold" style={{ color: '#DC3545' }}>{lostOpportunities}</p>
        </div>
        <div>
          <p className="text-gray-700">Tasa de Conversión (Simulado):</p>
          <p className="text-2xl font-bold" style={{ color: '#FFC107' }}>{conversionRate.toFixed(2)}%</p>
        </div>
      </div>
      {/* Aquí podrías añadir gráficos simples si fuera necesario */}
    </div>
  );
};

export default DashboardStatsPanel;