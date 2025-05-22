import React from 'react';

const OpportunityChartComponent = ({ opportunities }) => {
  const activeCount = opportunities.filter(op => op.status === 'active').length;
  const wonCount = opportunities.filter(op => op.status === 'closed' && op.outcome === 'won').length;
  const lostCount = opportunities.filter(op => op.status === 'closed' && op.outcome === 'lost').length;
  const total = activeCount + wonCount + lostCount;

  const activeHeight = total > 0 ? (activeCount / total) * 100 : 0;
  const wonHeight = total > 0 ? (wonCount / total) * 100 : 0;
  const lostHeight = total > 0 ? (lostCount / total) * 100 : 0;

  return (
    <div className="flex items-end h-48 border-b border-gray-200 pb-2">
      <div className="flex-1 flex flex-col items-center justify-end mr-4">
        <div 
          className="w-12 bg-blue-500 rounded-t-lg transition-all duration-500" 
          style={{ height: `${activeHeight}%` }}
        ></div>
        <div className="text-sm mt-2 text-center">Activas ({activeCount})</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-end mr-4">
        <div 
          className="w-12 bg-green-500 rounded-t-lg transition-all duration-500" 
          style={{ height: `${wonHeight}%` }}
        ></div>
        <div className="text-sm mt-2 text-center">Ganadas ({wonCount})</div>
      </div>
      <div className="flex-1 flex flex-col items-center justify-end">
        <div 
          className="w-12 bg-red-500 rounded-t-lg transition-all duration-500" 
          style={{ height: `${lostHeight}%` }}
        ></div>
        <div className="text-sm mt-2 text-center">Perdidas ({lostCount})</div>
      </div>
    </div>
  );
};

export default OpportunityChartComponent;