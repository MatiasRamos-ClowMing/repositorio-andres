// ... (código existente, solo cambiar el onSave en el botón de submit)
const handleSubmit = (e) => {
  e.preventDefault();
  const opportunity = {
    ...formData,
    id: opportunityToEdit ? opportunityToEdit.id : Date.now()
  };

  if (opportunityToEdit) {
    updateOpportunity(opportunity.id, opportunity);
  } else {
    addOpportunity(opportunity);
  }

  onSave(); // Esto ahora actualizará el estado en App.js
  onClose();
};

// DONE