const baseDate = new Date(); // today

export function offsetDate(days) {
  const date = new Date(baseDate.getTime() + days * 86400000);

  const day = date.getDate(); // 1-31
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const month = monthNames[date.getMonth()]; // 0-11
  const year = date.getFullYear();

  return `${day} ${month} ${year}`;
}
