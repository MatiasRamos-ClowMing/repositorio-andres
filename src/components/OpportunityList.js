import React, { useState, useEffect } from 'react';
import OpportunityCard from './OpportunityCard';
import OpportunityFilter from './OpportunityFilter';

const OpportunityList = ({ opportunities, onEditOpportunity }) => {
  const [filteredOpportunities, setFilteredOpportunities] = useState([]);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    setFilteredOpportunities(opportunities);
    const uniqueCategories = [...new Set(opportunities.map(op => op.category))];
    setCategories(uniqueCategories);
  }, [opportunities]);

  const handleFilterChange = (filters) => {
    let result = [...opportunities];
    
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
    
    if (filters.status !== 'all') {
      result = result.filter(op => op.status === filters.status);
    }
    
    if (filters.sort) {
      const [field, order] = filters.sort.split('-');
      result.sort((a, b) => {
        const dateA = new Date(a[field]);
        const dateB = new Date(b[field]);
        return order === 'asc' ? dateA - dateB : dateB - dateA;
      });
    } else {
      result.sort((a, b) => new Date(a.deliveryDate) - new Date(b.deliveryDate));
    }
    
    setFilteredOpportunities(result);
  };

  return (
    <div className="space-y-6">
      <OpportunityFilter 
        categories={categories} 
        onFilterChange={handleFilterChange} 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredOpportunities.length > 0 ? (
          filteredOpportunities.map(opportunity => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onEdit={onEditOpportunity}
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

export default OpportunityList;