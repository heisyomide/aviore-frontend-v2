export const formatCurrency = (value: any) => {
  const amount = typeof value === 'number' ? value : parseFloat(value);
  return isNaN(amount) ? "0" : amount.toLocaleString();
};

export const formatRating = (value: any) => {
  const rate = parseFloat(value);
  return isNaN(rate) ? "0.0" : rate.toFixed(1);
};