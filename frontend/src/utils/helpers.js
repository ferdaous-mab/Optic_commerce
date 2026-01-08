// Formater la date
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('fr-FR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

// Formater le prix
export const formatPrice = (price) => {
  return new Intl.NumberFormat('fr-MA', {
    style: 'currency',
    currency: 'MAD',
  }).format(price);
};

// Tronquer le texte
export const truncateText = (text, maxLength) => {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
};

// Valider l'email
export const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

// Calculer le statut du stock
export const getStockStatus = (stock) => {
  if (stock === 0) return { label: 'Rupture', color: 'red' };
  if (stock < 10) return { label: 'Faible', color: 'orange' };
  if (stock < 50) return { label: 'Moyen', color: 'yellow' };
  return { label: 'Bon', color: 'green' };
};