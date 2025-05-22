import { formatDate } from './timeUtils';

export const generateOpportunityPdf = (opportunity) => {
  const {
    name,
    description,
    crmNumber,
    receptionDate,
    deliveryDate,
    category,
    country,
    assignedPreSales,
    notes,
    status,
    outcome,
    closedDate
  } = opportunity;

  // Simulación de contenido PDF en formato de texto plano
  // En una aplicación real, usarías una librería como jsPDF o pdfmake
  // para generar un PDF estructurado.
  const pdfContent = `
    Oportunidad: ${name}
    --------------------------------------------------
    Número CRM: ${crmNumber}
    Categoría: ${category}
    País: ${country}
    Estado: ${status === 'active' ? 'Activa' : 
             status === 'closed' && outcome === 'won' ? 'Ganada' :
             status === 'closed' && outcome === 'lost' ? 'Perdida' :
             'Cerrada'}
    Preventa Asignado: ${assignedPreSales || 'N/A'}
    
    Fecha Recepción: ${formatDate(receptionDate)}
    Fecha Entrega: ${formatDate(deliveryDate)}
    ${status === 'closed' && closedDate ? `Fecha Cierre: ${formatDate(closedDate)}` : ''}

    --------------------------------------------------
    Descripción:
    ${description || 'Sin descripción'}

    --------------------------------------------------
    Notas de Seguimiento:
    ${notes.length > 0 ? notes.map((note, index) => `  - ${note}`).join('\n') : 'Sin notas'}
    --------------------------------------------------
  `;

  // Simulación de descarga de archivo de texto
  const blob = new Blob([pdfContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `oportunidad_${crmNumber}.txt`; // Descargar como .txt simulando PDF
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert('Simulación de exportación a PDF (descargado como archivo de texto)');
};

export const generateStatsPdf = (opportunities, filterRange) => {
  const totalOpen = opportunities.filter(op => op.status === 'active').length;
  const wonOpportunities = opportunities.filter(op => op.status === 'closed' && op.outcome === 'won').length;
  const lostOpportunities = opportunities.filter(op => op.status === 'closed' && op.outcome === 'lost').length;
  const totalClosed = wonOpportunities + lostOpportunities;
  const totalOpportunities = opportunities.length;
  const conversionRate = totalClosed > 0 ? (wonOpportunities / totalClosed) * 100 : 0;

  const rangeText = filterRange === 'all' ? 'Todas' : filterRange === 'month' ? 'Último Mes' : 'Últimos 3 Meses';

  const pdfContent = `
    Reporte de Estadísticas de Oportunidades
    --------------------------------------------------
    Rango de Tiempo: ${rangeText}
    --------------------------------------------------
    Total Oportunidades: ${totalOpportunities}
    Oportunidades Abiertas: ${totalOpen}
    Oportunidades Ganadas: ${wonOpportunities}
    Oportunidades Perdidas: ${lostOpportunities}
    Tasa de Conversión: ${conversionRate.toFixed(2)}%
    --------------------------------------------------
    Detalle de Oportunidades (${rangeText}):
    ${opportunities.length > 0 ? opportunities.map(op => `
      - ${op.name} (CRM: ${op.crmNumber})
        Estado: ${op.status === 'active' ? 'Activa' : op.status === 'closed' && op.outcome === 'won' ? 'Ganada' : op.status === 'closed' && op.outcome === 'lost' ? 'Perdida' : 'Cerrada'}
        Preventa: ${op.assignedPreSales || 'N/A'}
        Entrega: ${formatDate(op.deliveryDate)}
        ${op.status === 'closed' && op.closedDate ? `Cierre: ${formatDate(op.closedDate)}` : ''}
    `).join('\n') : 'No hay oportunidades en este rango.'}
    --------------------------------------------------
  `;

  const blob = new Blob([pdfContent], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `reporte_oportunidades_${rangeText.replace(/\s/g, '_')}.txt`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);

  alert('Simulación de generación de reporte PDF (descargado como archivo de texto)');
};

// DONE