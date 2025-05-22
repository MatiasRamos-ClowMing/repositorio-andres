import React, { useState, useEffect } from 'react';
import OpportunityCardComponent from './OpportunityCardComponent';
import OpportunityFilterComponent from './OpportunityFilterComponent';
import { deleteOpportunity } from '../utils/storage';

const OpportunityListComponent = ({ opportunities, onEditOpportunity, currentUser }) => {
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [categories, setCategories] = useState([]);
  const [currentFilters, setCurrentFilters] = useState({ // Estado para mantener los filtros actuales
    category: '',
    country: '',
    assignedPreSales: '',
    status: 'active',
    search: ''
  });

  useEffect(() => {
    // Aplicar filtros cada vez que cambian las oportunidades o los filtros
    applyFilters(opportunities, currentFilters);
    const uniqueCategories = [...new Set(opportunities.map(op => op.category))];
    setCategories(uniqueCategories);
  }, [opportunities, currentFilters]); // Dependencia de opportunities y currentFilters

  const applyFilters = (ops, filters) => {
    let result = [...ops];
    
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      result = result.filter(op => 
        op.name.toLowerCase().includes(searchTerm) || 
        op.crmNumber.toLowerCase().includes(searchTerm)
      );
    }
    
    if (filters.category) {
      result = result.filter(op => op.category === filters.category);
    }

    if (filters.assignedPreSales) {
      result = result.filter(op => op.assignedPreSales === filters.assignedPreSales);
    }
    
    // Filtrado por estado mejorado
    if (filters.status !== 'all') {
      if (filters.status === 'active') {
        result = result.filter(op => op.status === 'active');
      } else if (filters.status === 'closed') {
        result = result.filter(op => op.status === 'closed');
      } else if (filters.status === 'closed-won') {
        result = result.filter(op => op.status === 'closed' && op.outcome === 'won');
      } else if (filters.status === 'closed-lost') {
        result = result.filter(op => op.status === 'closed' && op.outcome === 'lost');
      }
    }
    
    if (filters.sort) {
      const [field, order] = filters.sort.split('-');
      result.sort((a, b) => {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else {
      // Orden por defecto: más próximas primero
      result.sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
    }
    
    setFilteredOpportunities(result);
  };

  const handleFilterChange = (filters) => {
    setCurrentFilters(filters); // Actualizar el estado de los filtros
  };

  const handleDelete = (id) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta oportunidad?')) {
      deleteOpportunity(id);
      window.dispatchEvent(new Event('storage'));
    }
  };

  return (
    <div className="space-y-6">
      <OpportunityFilterComponent 
        categories={categories} 
        onFilterChange={handleFilterChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map(opportunity => (
            <OpportunityCardComponent
              key={opportunity.id}
              opportunity={opportunity}
              onEdit={onEditOpportunity}
              onDelete={handleDelete}
              currentUser={currentUser}
            />
          ))
        ) : (
          <div className="col-span-full text-center py-10 text-gray-500">
            No se encontraron oportunidades con los filtros aplicados
          </div>
        )}
      </div>
    </div>
  );
};

export default OpportunityListComponent;

// DONE