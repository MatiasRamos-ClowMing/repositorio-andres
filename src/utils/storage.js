export const getOpportunities = () => {
  const data = localStorage.getItem('opportunities');
  return data ? JSON.parse(data) : [];
};

export const updateOpportunity = (id, updatedOpportunity) => {
  const opportunities = getOpportunities();
  const index = opportunities.findIndex(op => op.id === id);
  if (index !== -1) {
    opportunities[index] = updatedOpportunity;
    localStorage.setItem('opportunities', JSON.stringify(opportunities));
  }
};

export const addOpportunity = (opportunity) => {
  const opportunities = getOpportunities();
  opportunities.push(opportunity);
  localStorage.setItem('opportunities', JSON.stringify(opportunities));
};

export const deleteOpportunity = (id) => {
  const opportunities = getOpportunities();
  const updatedOpportunities = opportunities.filter(op => op.id !== id);
  localStorage.setItem('opportunities', JSON.stringify(updatedOpportunities));
};

// Función para validar y normalizar los datos (actualizada con campos outcome y closedDate)
export const validateOpportunityData = (data) => {
  if (!Array.isArray(data)) return [];
  
  return data.map(item => ({
    id: typeof item.id === 'number' ? item.id : Date.now(),
    name: typeof item.name === 'string' ? item.name : 'Sin nombre',
    description: typeof item.description === 'string' ? item.description : '',
    crmNumber: typeof item.crmNumber === 'string' ? item.crmNumber : 'SN',
    receptionDate: typeof item.receptionDate === 'string' ? item.receptionDate : new Date().toISOString(),
    deliveryDate: typeof item.deliveryDate === 'string' ? item.deliveryDate : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    category: ['Gestión', 'Desarrollo', 'Infraestructura', 'Seguridad', 'Otros'].includes(item.category) ? item.category : 'Otros',
    country: ['Colombia', 'Perú', 'España'].includes(item.country) ? item.country : 'Colombia',
    assignedPreSales: ['Carolina Tovar Catiblanco', 'Andres Camilo Uribe'].includes(item.assignedPreSales) ? item.assignedPreSales : 'Carolina Tovar Catiblanco',
    notes: Array.isArray(item.notes) ? item.notes : [],
    status: ['active', 'closed'].includes(item.status) ? item.status : 'active',
    outcome: ['won', 'lost'].includes(item.outcome) ? item.outcome : null, // Resultado de la oportunidad cerrada
    closedDate: typeof item.closedDate === 'string' ? item.closedDate : null // Fecha de cierre
  }));
};