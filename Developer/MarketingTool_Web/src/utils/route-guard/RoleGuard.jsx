import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// @project
import PageLoader from '@/components/PageLoader';
import PermissionDenied from '@/components/PermissionDenied';
import useCurrentUser from '@/hooks/useCurrentUser';
import menuItems from '@/menu';
import { usePathname } from '@/utils/navigation';

/***************************  ROLE GUARD  ***************************/

export default function RoleGuard({ children }) {
  const pathname = usePathname();

  const [activeItem, setActiveItem] = useState();

  const { isProcessing, userData } = useCurrentUser();
  const currentRole = userData?.role; // 'admin' or 'user'

  useEffect(() => {
    const findMenuItem = async () => {
      const matchedItem = await findMenu();
      setActiveItem(matchedItem);
    };
    findMenuItem();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const findMenu = () => {
    return new Promise((resolve) => {
      for (const menu of menuItems?.items) {
        if (menu.type === 'group') {
          const matchedParents = findParentElements(menu.children || [], pathname);
          if (matchedParents) {
            resolve(matchedParents[0]); // Get the first matched parent item
            return;
          }
        }
      }
      resolve(undefined);
    });
  };

  const findParentElements = (navItems, targetUrl, parents = []) => {
    for (const item of navItems) {
      const newParents = [...parents, item];

      if (item.url === targetUrl) {
        return newParents;
      }

      if (item.children) {
        const result = findParentElements(item.children, targetUrl, newParents);
        if (result) {
          return result;
        }
      }
    }

    return null;
  };

  if (isProcessing) return <PageLoader />;

  if (activeItem?.roles?.length && currentRole && !activeItem.roles.includes(currentRole)) {
    return <PermissionDenied />;
  }

  return <>{children}</>;
}

RoleGuard.propTypes = { children: PropTypes.node };
