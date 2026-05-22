import { useEffect, useState } from 'react';

// @project
import { useRouter } from '@/utils/navigation';

/***************************  HOOKS - BASE URL  ***************************/

/**
 * Custom hook to determine the base URL of the current application.
 *
 * Features:
 * - Dynamically computes the protocol (`http` or `https`) and host.
 * - Uses React state to store the base URL, ensuring reactivity.
 * - Reacts to route changes by including the `useRouter` dependency.
 *
 * @returns {string | null} The base URL (e.g., "https://example.com") or `null` if not set.
 */

export default function useBaseUrl() {
  // State to store the computed base URL
  const [baseUrl, setBaseUrl] = useState(null);
  const router = useRouter();

  useEffect(() => {
    // Ensure this runs only on the client side
    if (typeof window !== 'undefined') {
      // Get the protocol (e.g., "http:" or "https:")
      const protocol = window.location.protocol;

      // Get the host (e.g., "example.com:3000")
      const host = window.location.host;

      // Combine protocol and host to form the base URL
      setBaseUrl(`${protocol}//${host}`);
    }
  }, [router]);

  // Return the computed base URL
  return baseUrl;
}
