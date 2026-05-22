import PropTypes from 'prop-types';
// @mui
import List from '@mui/material/List';
import Typography from '@mui/material/Typography';

// @project
import NavCollapse from './NavCollapse';
import NavItem from './NavItem';
import useCurrentUser from '@/hooks/useCurrentUser';

// @types

// @style
const groupDivider = {
  '&:before': {
    content: '""',
    display: 'block',
    position: 'absolute',
    top: 0,
    left: 16,
    height: '1px',
    width: 44,
    bgcolor: 'divider'
  }
};

/***************************  MINI DRAWER - GROUP  ***************************/

export default function NavGroup({ item }) {
  const { userData } = useCurrentUser();

  const renderNavItem = (menuItem) => {
    const userRole = userData?.role;

    // Check if menuItem has roles and whether userRole is allowed
    if (menuItem.roles?.length && userRole && !menuItem.roles.includes(userRole)) {
      return null;
    }

    // Render items based on the type
    switch (menuItem.type) {
      case 'collapse':
        return <NavCollapse key={menuItem.id} item={menuItem} />;
      case 'item':
        return <NavItem key={menuItem.id} item={menuItem} />;
      default:
        return (
          <Typography key={menuItem.id} variant="h6" color="error" align="center">
            Error
          </Typography>
        );
    }
  };

  return (
    <List component="div" sx={{ '&:not(:first-of-type)': groupDivider }}>
      {item.children?.map((menuItem) => renderNavItem(menuItem))}
    </List>
  );
}

NavGroup.propTypes = { item: PropTypes.any };
