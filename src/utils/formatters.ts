
// Format currency to Indian Rupees
export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format numbers with commas (Indian format)
export const formatNumber = (num: number): string => {
  return new Intl.NumberFormat('en-IN').format(num);
};

// Format percentage
export const formatPercentage = (percentage: number): string => {
  return `${percentage >= 0 ? '+' : ''}${percentage.toFixed(2)}%`;
};
