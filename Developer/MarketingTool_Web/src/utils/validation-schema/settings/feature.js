export const featureNameSchema = {
  required: 'Feature name is required',
  pattern: { value: /^[a-zA-Z\s]+$/, message: 'Invalid feature name' }
};
