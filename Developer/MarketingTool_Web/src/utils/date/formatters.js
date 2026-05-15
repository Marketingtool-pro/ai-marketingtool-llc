export function formatDate(date) {
  const d = typeof date === 'string' ? new Date(date) : date;

  return d.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
