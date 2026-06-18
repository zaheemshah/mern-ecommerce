export const formatPrice = (price) =>
  new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(price || 0);

export const getEffectivePrice = (product) =>
  product?.discountPrice > 0 ? product.discountPrice : product?.price || 0;

export const getImageUrl = (image) => {
  if (!image) return 'https://via.placeholder.com/400x400?text=No+Image';
  if (image.startsWith('http')) return image;
  const base = import.meta.env.VITE_API_URL?.replace('/api', '') || '';
  return `${base}${image}`;
};

export const formatDate = (date) =>
  new Date(date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
