export function formatPrice(price?: number | null): string {
  if (price == null) return '-';
  return new Intl.NumberFormat('fr-FR').format(price) + ' FCFA';
}

export function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}
