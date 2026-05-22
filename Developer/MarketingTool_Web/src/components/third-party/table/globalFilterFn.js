/***************************  REACT TABLE - GLOBAL FILTER  ***************************/

export default function globalFilterFn(row, columnIds, filterValue) {
  return columnIds.some((id) => {
    const value = row.getValue(id);
    return deepSearch(value, filterValue.toLowerCase());
  });
}

function deepSearch(value, filterValue) {
  if (typeof value === 'string' || typeof value === 'number') {
    return value.toString().toLowerCase().includes(filterValue);
  }

  if (Array.isArray(value)) {
    return value.some((item) => deepSearch(item, filterValue));
  }

  if (typeof value === 'object' && value !== null) {
    return Object.values(value).some((nested) => deepSearch(nested, filterValue));
  }

  return false;
}
