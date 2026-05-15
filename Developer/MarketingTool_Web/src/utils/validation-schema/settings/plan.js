export function trimOnBlur(onBlur, onChange) {
  return (e) => {
    const trimmed = e.target.value.trim();
    onChange(trimmed);
    onBlur();
  };
}

export function conditionalSchema(isPublishing) {
  return {
    required: (message) => (isPublishing ? message : false),

    validateRequiredTrim: (value, message) => {
      const trimmed = value.trim();
      if (!trimmed && isPublishing) return message;
      if (!trimmed) return true;
      return true;
    }
  };
}

export function getPlanFormSchemas(isPublishing) {
  const cond = conditionalSchema(isPublishing);

  return {
    nameSchema: {
      required: cond.required('Plan name is required')
    },
    priceModalSchema: {
      required: cond.required('Price modal is required')
    },
    pricingOptionsSchema: {
      required: cond.required('At least one billing period is required')
    },
    featuresSchema: {
      required: cond.required('At least one feature is required')
    }
  };
}
