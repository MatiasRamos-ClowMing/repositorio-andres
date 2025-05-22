import React, { useState, useEffect } from 'react';
import { getOpportunities } from '../utils/storage';
import OpportunityChartComponent from './OpportunityChartComponent'; // Reutilizamos el componente de gráfica de barras
import { generateStatsPdf } from '../utils/pdfUtils'; // Importar la función de reporte

const StatsDashboard = ({ onBackToDashboard }) => {
  const [opportunities, setOpportunities] = useState([]);
  const [filterRange, setFilterRange] = useState('all'); // 'all', 'month', '3months'

  useEffect(() => {
    const loadOpportunities = () => {
      const loadedOpportunities = getOpportunities();
      setOpportunities(loadedOpportunities);
    };
    loadOpportunities();

    window.addEventListener('storage', loadOpportunities);

    return () => {
      window.removeEventListener('storage', loadOpportunities);
    };
  }, []);

  const filterOpportunitiesByRange = (ops) => {
    const now = new Date();
    return ops.filter(op => {
      if (filterRange === 'all') return true;
      const receptionDate = new Date(op.receptionDate);
      if (filterRange === 'month') {
        return receptionDate.getMonth() === now.getMonth() && receptionDate.getFullYear() === now.getFullYear();
      }
      if (filterRange === '3months') {
        const threeMonthsAgo = new Date(now.setMonth(now.getMonth() - 3));
        return receptionDate >= threeMonthsAgo;
      }
      return true;
    });
  };

  const filteredOpportunities = filterOpportunitiesByRange(opportunities);

  const totalOpen = filteredOpportunities.filter(op => op.status === 'active').length;
  const wonOpportunities = filteredOpportunities.filter(op => op.status === 'closed' && op.outcome === 'won').length;
  const lostOpportunities = filteredOpportunities.filter(op => op.status === 'closed' && op.outcome === 'lost').length;
  const totalClosed = wonOpportunities + lostOpportunities;
  const totalOpportunities = filteredOpportunities.length;

  const conversionRate = totalClosed > 0 ? (wonOpportunities / totalClosed) * 100 : 0;

  // Datos para el gráfico circular
  const pieChartData = [
    { label: 'Ganadas', value: wonOpportunities, color: '#28A745' },
    { label: 'Perdidas', value: lostOpportunities, color: '#DC3545' },
  ];

  // Componente simple de gráfico circular (simulado con divs)
  const PieChartComponent = ({ data }) => {
    const total = data.reduce((sum, item) => sum + item.value, 0);
    if (total === 0) return <div className="text-center text-gray-500">No hay datos para el gráfico circular.</div>;

    let currentAngle = 0;
    return (
      <div className="relative w-48 h-48 mx-auto">
        {data.map((item, index) => {
          const percentage = (item.value / total) * 100;
          const angle = (percentage / 100) * 360;
          const style = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            clip: 'rect(0, 240px, 240px, 120px)',
            transform: `rotate(${currentAngle}deg)`,
            backgroundColor: item.color,
          };
          const halfCircleStyle = {
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            borderRadius: '50%',
            clip: 'rect(0, 120px, 240px, 0)',
            transform: `rotate(${angle > 180 ? 180 : angle}deg)`,
            backgroundColor: item.color,
          };

          currentAngle += angle;

          return (
            <div key={index} className="absolute w-full h-full rounded-full" style={{ background: `conic-gradient(${data.map((d, i) => `${d.color} ${data.slice(0, i).reduce((sum, prev) => sum + (prev.value / total) * 360, 0)}deg ${data.slice(0, i + 1).reduce((sum, prev) => sum + (prev.value / total) * 360, 0)}deg`).join(', ')})` }}>
              {/* Implementación simple con conic-gradient */}
            </div>
          );
        })}
         <div className="absolute inset-4 bg-white rounded-full flex items-center justify-center text-center text-sm font-bold">
            {conversionRate.toFixed(1)}%<br/>Conversión
         </div>
      </div>
    );
  };


  const handleGenerateReport = () => {
    generateStatsPdf(filteredOpportunities, filterRange);
  };

  return (
    <div className="p-4 md:p-8">
      <h2 className="text-2xl font-bold mb-6" style={{ color: '#811c58', fontFamily: 'Century Gothic, sans-serif' }}>Estadísticas de Oportunidades</h2>

      <div className="mb-4">
        <label className="block text-sm font-medium mb-1">Filtrar por Rango de Tiempo:</label>
        <select
          value={filterRange}
          onChange={(e) => setFilterRange(e.target.value)}
          className="p-2 border rounded"
        >
          <option value="all">Todas</option>
          <option value="month">Último Mes</option>
          <option value="3months">Últimos 3 Meses</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700">Total Oportunidades:</p>
          <p className="text-3xl font-bold" style={{ color: '#007BFF' }}>{totalOpportunities}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700">Oportunidades Abiertas:</p>
          <p className="text-3xl font-bold" style={{ color: '#FFC107' }}>{totalOpen}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700">Oportunidades Ganadas:</p>
          <p className="text-3xl font-bold" style={{ color: '#28A745' }}>{wonOpportunities}</p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <p className="text-gray-700">Oportunidades Perdidas:</p>
          <p className="text-3xl font-bold" style={{ color: '#DC3545' }}>{lostOpportunities}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Gráfico de Barras */}
        <div className="bg-white p-6 rounded-lg shadow-sm">
           <h3 className="text-xl font-semibold mb-4">Oportunidades por Estado</h3>
           <OpportunityChartComponent opportunities={filteredOpportunities} />
        </div>

        {/* Gráfico Circular */}
        <div className="bg-white p-6 rounded-lg shadow-sm flex flex-col items-center justify-center">
           <h3 className="text-xl font-semibold mb-4">Distribución Ganadas vs Perdidas</h3>
           <PieChartComponent data={pieChartData} />
           <div className="flex justify-center space-x-4 mt-4">
              <div className="flex items-center">
                 <span className="block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#28A745' }}></span>
                 Ganadas ({wonOpportunities})
              </div>
              <div className="flex items-center">
                 <span className="block w-3 h-3 rounded-full mr-2" style={{ backgroundColor: '#DC3545' }}></span>
                 Perdidas ({lostOpportunities})
              </div>
           </div>
        </div>
      </div>

      {/* Sección para reportes */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-4">Generar Reportes</h3>
        <p className="text-gray-700 mb-4">Genera un reporte PDF con las estadísticas actuales (filtradas por rango de tiempo).</p>
        <button
          onClick={handleGenerateReport}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
        >
          Generar Reporte PDF (Simulado)
        </button>
      </div>

      {/* Sección para Feedback (simulada) */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
        <h3 className="text-xl font-semibold mb-4">Feedback</h3>
        <p className="text-gray-700 mb-4">Ayúdanos a mejorar este apartado. ¿Qué te parece? ¿Qué estadísticas adicionales te gustaría ver?</p>
        <textarea
          className="w-full p-2 border rounded mb-4"
          rows="4"
          placeholder="Escribe tu feedback aquí..."
        ></textarea>
        <button className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors">
          Enviar Feedback (Simulado)
        </button>
      </div>

      <button
        onClick={onBackToDashboard}
        className="mt-6 px-4 py-2 border rounded hover:bg-gray-100 transition-colors"
      >
        Volver al Dashboard
      </button>
    </div>
  );
};

export default StatsDashboard;