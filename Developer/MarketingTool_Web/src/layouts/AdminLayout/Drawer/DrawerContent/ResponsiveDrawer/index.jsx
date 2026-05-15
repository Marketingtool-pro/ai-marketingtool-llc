// @mui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import NavGroup from './NavGroup';
import menuItems from '@/menu';
import useCurrentUser from '@/hooks/useCurrentUser';

/***************************  DRAWER CONTENT - RESPONSIVE DRAWER  ***************************/

export default function ResponsiveDrawer() {
  const { userData } = useCurrentUser();
  const userRole = userData?.role;

  const navGroups = menuItems.items.map((item, index) => {
    if (item.roles?.length && userRole && !item.roles.includes(userRole)) {
      return null;
    }

    switch (item.type) {
      case 'group':
        return <NavGroup key={index} item={item} />;
      default:
        return (
          <Typography key={index} variant="h6" color="error" align="center">
            Fix - Navigation Group
          </Typography>
        );
    }
  });

  return <Box sx={{ py: 1, transition: 'all 0.3s ease-in-out' }}>{navGroups}</Box>;
}
