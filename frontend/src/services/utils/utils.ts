export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price);
};

export const calculateAge = (birthYear: number): number => {
  return new Date().getFullYear() - birthYear;
};
