/***************************  REACT TABLE - GLOBAL FILTER  ***************************/

export function globalFilterFn(row, columnIds, filterValue) {
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

/***************************  COLUMN FILTER - INCLUDES  ***************************/

export function includesSome(row, columnId, filterValue) {
  // check whether any value in an array of strings exists in another array of strings
  if (Array.isArray(row.getValue(columnId))) {
    return row.getValue(columnId).some((val) => filterValue.includes(val));
  }

  // check value exists in an array of strings
  return filterValue.includes(row.getValue(columnId));
}

/***************************  COLUMN FILTER - IN RANGE  ***************************/

export function numberInRange(row, columnId, value) {
  const rowDate = Number(row.getValue(columnId));
  const start = value[0];
  const end = value[1];

  if (start && rowDate < start) return false;
  if (end && rowDate > end) return false;
  return true;
}

/***************************  COLUMN FILTER - DATE IN RANGE  ***************************/

export function dateInRange(row, columnId, value) {
  const rowDate = new Date(row.getValue(columnId));
  const start = value.start ? new Date(value.start) : null;
  const end = value.end ? new Date(new Date(value.end).setHours(23, 59, 59, 999)) : null;

  if (start && rowDate < start) return false;
  if (end && rowDate > end) return false;
  return true;
}
