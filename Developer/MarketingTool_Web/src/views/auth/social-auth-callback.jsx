import { useEffect } from 'react';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import PageLoader from '@/components/PageLoader';
import { APP_DEFAULT_PATH, AUTH_USER_KEY } from '@/config';
import { appwriteAccount } from '@/utils/auth-client/appwrite';
import { useRouter } from '@/utils/navigation';

/***************************  AUTH - CALLBACK  ***************************/

export default function SocialAuthCallback() {
  const router = useRouter();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // After OAuth redirect, Appwrite session is already active
        const user = await appwriteAccount.get();
        const jwtResponse = await appwriteAccount.createJWT();

        const userData = {
          id: user.$id,
          email: user.email,
          access_token: jwtResponse.jwt,
          firstname: user.name?.split(' ')[0] || '',
          lastname: user.name?.split(' ').slice(1).join(' ') || '',
          role: user.labels?.includes('admin') ? 'admin' : 'user'
        };

        localStorage.setItem(AUTH_USER_KEY, JSON.stringify(userData));
        router.replace(APP_DEFAULT_PATH);
      } catch {
        enqueueSnackbar('Authentication failed. Please try again.', { variant: 'error' });
        router.replace('/login');
      }
    };

    handleAuthCallback();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <PageLoader />;
}
