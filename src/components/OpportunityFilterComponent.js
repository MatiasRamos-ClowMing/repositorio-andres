import React, { useState, useEffect } from 'react';
import { getOpportunities } from '../utils/storage';

const OpportunityFilterComponent = ({ categories, onFilterChange }) => {
  const [filters, setFilters] = useState({
    category: '',
    country: '',
    assignedPreSales: '',
    status: 'active', // Filtro por defecto a activas
    search: ''
  });

  const [preSalesOptions, setPreSalesOptions] = useState([]);

  useEffect(() => {
    const opportunities = getOpportunities();
    const uniquePreSales = [...new Set(opportunities.map(op => op.assignedPreSales).filter(Boolean))];
    const fixedOptions = ['Carolina Tovar Catiblanco', 'Andres Camilo Uribe'];
    const allPreSales = [...new Set([...fixedOptions, ...uniquePreSales])];
    setPreSalesOptions(allPreSales);
  }, []);


  const handleChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...filters, [name]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
  };

  const countries = ['Colombia', 'Perú', 'España'];

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Buscar</label>
          <input
            type="text"
            name="search"
            value={filters.search}
            onChange={handleChange}
            placeholder="Nombre o CRM"
            className="w-full p-2 border rounded"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Categoría</label>
          <select
            name="category"
            value={filters.category}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Todas</option>
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">País</label>
          <select
            name="country"
            value={filters.country}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Todos</option>
            {countries.map((country) => (
              <option key={country} value={country}>{country}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Preventa Asignado</label>
          <select
            name="assignedPreSales"
            value={filters.assignedPreSales}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="">Todos</option>
            {preSalesOptions.map(option => (
              <option key={option} value={option}>{option}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Estado</label>
          <select
            name="status"
            value={filters.status}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          >
            <option value="all">Todos</option>
            <option value="active">Activas</option>
            <option value="closed">Cerradas</option>
            <option value="closed-won">Ganadas</option>
            <option value="closed-lost">Perdidas</option>
          </select>
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Ordenar por</label>
          <select
            name="sort"
            onChange={(e) => onFilterChange({ ...filters, sort: e.target.value })}
            className="w-full p-2 border rounded"
          >
            <option value="deliveryDate-asc">Fecha entrega (próximas)</option>
            <option value="deliveryDate-desc">Fecha entrega (lejanas)</option>
            <option value="receptionDate-desc">Recientes primero</option>
            <option value="receptionDate-asc">Antiguas primero</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default OpportunityFilterComponent;