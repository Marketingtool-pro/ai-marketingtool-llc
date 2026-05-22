import PropTypes from 'prop-types';
import { Activity, useEffect } from 'react';

// @mui
import { useColorScheme, useTheme } from '@mui/material/styles';
import ButtonBase from '@mui/material/ButtonBase';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';

// @project
import { handlerActiveItem, useGetMenuMaster } from '@/states/menu';
import DynamicIcon from '@/components/DynamicIcon';
import RouterLink from '@/components/Link';
import { ThemeMode } from '@/config';
import { usePathname } from '@/utils/navigation';

// @third-party
import { FormattedMessage } from 'react-intl';

/***************************  MINI DRAWER - ITEM  ***************************/

export default function NavItem({ item, level = 0 }) {
  const theme = useTheme();
  const { colorScheme } = useColorScheme();
  const { menuMaster } = useGetMenuMaster();
  const openItem = menuMaster.openedItem;

  // Active menu item on page load
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === item.url) handlerActiveItem(item.id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const isSelected = openItem === item.id;
  const iconcolor = isSelected && colorScheme === ThemeMode.DARK ? theme.vars.palette.background.default : theme.vars.palette.text.primary;

  // level === 0 - list item button avatar style
  const listItemAvatarStyle = {
    p: 0,
    my: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    cursor: 'default',
    '&:hover, &:focus': { bgcolor: 'transparent', '& .MuiListItemAvatar-root': { bgcolor: 'action.hover' } },
    '&.Mui-selected': {
      bgcolor: 'transparent',
      '& .MuiListItemAvatar-root': { bgcolor: 'primary.lighter', ...theme.applyStyles('dark', { bgcolor: 'primary.main' }) },
      '&:hover, &:focus': { bgcolor: 'transparent', '& .MuiListItemAvatar-root': { bgcolor: 'primary.light' } }
    }
  };

  // level > 0 - popup list item text style
  const listItemStyle = {
    color: 'text.primary',
    '&.Mui-selected': {
      color: 'primary.main',
      bgcolor: 'transparent',
      ...theme.applyStyles('dark', { color: 'primary.light' }),
      '&:hover': { bgcolor: 'action.hover' },
      '&.Mui-focusVisible': { bgcolor: 'action.focus' },
      '& .MuiTypography-root': { fontWeight: 600 }
    }
  };

  return (
    <ListItemButton
      id={`${item.id}-btn`}
      selected={isSelected}
      disabled={item.disabled}
      disableRipple={level === 0}
      {...(level > 0 && { component: RouterLink, to: item.url, ...(item?.target && { target: '_blank' }) })}
      sx={{ ...(level === 0 ? listItemAvatarStyle : listItemStyle) }}
    >
      <Activity mode={level === 0 ? 'visible' : 'hidden'}>
        <ButtonBase
          component={RouterLink}
          to={item.url}
          {...(item?.target && { target: '_blank' })}
          tabIndex={-1}
          sx={{ borderRadius: 2 }}
          aria-label="list-button"
        >
          <ListItemAvatar
            sx={{
              minWidth: 32,
              width: 44,
              height: 44,
              borderRadius: 2,
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <ListItemIcon sx={{ minWidth: 0 }}>
              {item.iconImage ? (
                <img src={item.iconImage} alt="" width={24} height={24} style={{ objectFit: 'contain' }} />
              ) : (
                <DynamicIcon name={item.icon} size={22} stroke={1.5} color={iconcolor} />
              )}
            </ListItemIcon>
          </ListItemAvatar>
        </ButtonBase>
      </Activity>
      <Activity mode={level > 0 ? 'visible' : 'hidden'}>
        <ListItemText primary={<FormattedMessage id={item.title} />} />
      </Activity>
    </ListItemButton>
  );
}

NavItem.propTypes = { item: PropTypes.any, level: PropTypes.number };
