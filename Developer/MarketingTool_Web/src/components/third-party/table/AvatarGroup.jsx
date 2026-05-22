import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiAvatarGroup from '@mui/material/AvatarGroup';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import List from '@mui/material/List';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import Popper from '@mui/material/Popper';
import Box from '@mui/material/Box';

// @project
import SimpleBar from '@/components/third-party/SimpleBar';
import MainCard from '@/components/MainCard';
import { AvatarSize } from '@/enum';

/***************************  REACT TABLE - AVATAR GROUP  ***************************/

export default function AvatarGroup({ list, max = 5 }) {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'Avatar-popper' : undefined;

  const avatarData = [...list];
  const extraAvatar = [];
  if (avatarData?.length > max - 1) extraAvatar.push(...avatarData.slice(max - 1));

  return (
    <>
      <MuiAvatarGroup
        max={max}
        sx={{ width: 'fit-content' }}
        slotProps={{
          additionalAvatar: {
            sx: { cursor: 'pointer' },
            onClick: (event) => {
              setAnchorEl(anchorEl ? null : event.currentTarget);
            }
          }
        }}
      >
        {avatarData.map((item, index) => (
          <Avatar alt={item.name} src={item.photo} key={index} />
        ))}
      </MuiAvatarGroup>
      {extraAvatar.length > 0 && (
        <Popper placement="bottom-end" id={id} open={open} anchorEl={anchorEl} transition>
          {({ TransitionProps }) => (
            <Fade in={open} {...TransitionProps}>
              <MainCard sx={{ p: 0, borderRadius: 3, boxShadow: theme.vars.customShadows.tooltip, minWidth: 150 }}>
                <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                  <Box sx={{ p: 0.75 }}>
                    <SimpleBar sx={{ maxHeight: 220, height: 1 }}>
                      <List disablePadding>
                        {extraAvatar.map((item, index) => (
                          <ListItemButton key={index} sx={{ p: 0.75, borderRadius: 2 }}>
                            <ListItemAvatar sx={{ minWidth: 30 }}>
                              <Avatar src={item.photo} alt={item.name || ''} size={AvatarSize.XXS} />
                            </ListItemAvatar>
                            <ListItemText primary={item.name} slotProps={{ primary: { variant: 'caption', color: 'text.secondary' } }} />
                          </ListItemButton>
                        ))}
                      </List>
                    </SimpleBar>
                  </Box>
                </ClickAwayListener>
              </MainCard>
            </Fade>
          )}
        </Popper>
      )}
    </>
  );
}

AvatarGroup.propTypes = { list: PropTypes.object, max: PropTypes.number };
