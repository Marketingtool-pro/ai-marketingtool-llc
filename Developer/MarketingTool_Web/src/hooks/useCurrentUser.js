// @project
import { useAuth } from '@/contexts/AuthContext';

/***************************  HOOKS - CONFIG  ***************************/

/**
 * Custom hook to retrieve the current authenticated user and processing status.
 *
 * This hook leverages the `useAuth` context to extract and return:
 * - `userData`: Information about the currently authenticated user.
 * - `isProcessing`: Boolean indicating whether an authentication-related process is in progress.
 *
 * @returns {object} An object containing:
 *   - `userData`: The authenticated user's data.
 *   - `isProcessing`: A boolean indicating the processing state.
 *
 * Usage:
 * Ensure the component using this hook is wrapped in an `AuthProvider` to provide the `AuthContext`.
 */

export default function useCurrentUser() {
  const { user, isProcessing } = useAuth();
  return { userData: user, isProcessing };
}
