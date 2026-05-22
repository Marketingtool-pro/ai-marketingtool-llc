// @third-party
import { isAxiosError } from 'axios';

function isErrorWithMessage(obj) {
  return typeof obj === 'object' && obj !== null && 'error' in obj && typeof obj.error === 'string';
}

function extractErrorMessage(error) {
  if (isAxiosError(error)) {
    return error.response?.data?.message || error.message || 'Request failed. Please try again.';
  }

  if (isErrorWithMessage(error)) {
    return error.error;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'Something went wrong';
}

// ==============================|| ATTEMPT MIDDLEWARE ||============================== //

/**
 * A utility function that safely handles any asynchronous API call or Promise and returns a consistent { data, error } structure.
 */

export async function attempt(promise) {
  try {
    const data = await promise;
    return { data, error: null };
  } catch (error) {
    return { data: null, error: extractErrorMessage(error) };
  }
}
