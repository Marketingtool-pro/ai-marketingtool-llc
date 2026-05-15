/***************************  FILTER - REMOVE ITEM  ***************************/

export function removeFilterItem(blogFilter, filter, item) {
  const updatedFilters = blogFilter?.columnFilters
    .map((f) => {
      if (f.id === filter.id) {
        if (Array.isArray(f.value)) {
          const isStringArray = f.value.every((v) => typeof v === 'string');
          if (isStringArray) {
            const newValue = f.value.filter((v) => v !== item);
            return { ...f, value: newValue };
          }
        } else if (typeof f.value === 'object' && f.value !== null) {
          const newValue = Object.fromEntries(Object.entries(f.value).filter(([_, v]) => v !== item));
          return { ...f, value: newValue };
        }
      }
      return f;
    })
    .filter((f) => {
      if (Array.isArray(f.value)) return f.value.length > 0;
      if (typeof f.value === 'object' && f.value !== null) return Object.keys(f.value).length > 0;
      return true;
    });

  return { ...blogFilter, columnFilters: updatedFilters };
}
