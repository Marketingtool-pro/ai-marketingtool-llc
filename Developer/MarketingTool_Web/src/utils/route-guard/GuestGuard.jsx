import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// @project
import PageLoader from '@/components/PageLoader';
import { APP_DEFAULT_PATH, AUTH_USER_KEY } from '@/config';
import { useRouter } from '@/utils/navigation';

/***************************  GUEST GUARD  ***************************/

export default function GuestGuard({ children }) {
  const router = useRouter();
  const [isChecked, setIsChecked] = useState(false);

  const manageUserData = (localStorageData) => {
    const parsedAuthData = localStorageData ? JSON.parse(localStorageData) : null;
    if (parsedAuthData?.access_token) {
      router.replace(APP_DEFAULT_PATH);
    } else {
      setIsChecked(true);
    }
  };

  useEffect(() => {
    const localStorageData = typeof window !== 'undefined' ? localStorage.getItem(AUTH_USER_KEY) : null;
    manageUserData(localStorageData);

    const handleStorageEvent = (e) => {
      if (e.storageArea === localStorage && e.key === AUTH_USER_KEY) {
        manageUserData(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageEvent);

    return () => {
      window.removeEventListener('storage', handleStorageEvent);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isChecked) {
    return <PageLoader />;
  }

  return children;
}

GuestGuard.propTypes = { children: PropTypes.node };
