import { Activity, useState } from 'react';

// @mui
import { useColorScheme } from '@mui/material/styles';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Fade from '@mui/material/Fade';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { AnimatePresence, motion } from 'motion/react';

// @project
import { varSlide } from '@/components/third-party/motion/animate/dialog';
import MainCard from '@/components/MainCard';
import { ThemeMode } from '@/config';

// @assets
import { IconMoon, IconSun, IconSunMoon } from '@tabler/icons-react';

const themeModeData = [
  { title: 'Light', mode: ThemeMode.LIGHT, icon: <IconSun size={16} /> },
  { title: 'Dark', mode: ThemeMode.DARK, icon: <IconMoon size={16} /> },
  { title: 'System', mode: ThemeMode.SYSTEM, icon: <IconSunMoon size={16} /> }
];

/***************************  HEADER - THEME MODE SWITCHER  ***************************/

export default function ThemeModeSwitcher() {
  const { mode, setMode } = useColorScheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const id = open ? 'Theme-mode-popper' : undefined;

  const activeIcon = themeModeData.find((item) => item.mode === mode)?.icon;

  const handleClick = (event) => {
    event.preventDefault();
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  const onModeChange = (item) => {
    setAnchorEl(null);
    setMode(item.mode);
  };

  return (
    <>
      <IconButton variant="outlined" color="secondary" size="small" onClick={handleClick} aria-label="show theme mode">
        {activeIcon}
      </IconButton>
      <AnimatePresence>
        <Activity mode={open ? 'visible' : 'hidden'}>
          <Popper
            placement="bottom"
            id={id}
            open={open}
            anchorEl={anchorEl}
            transition
            popperOptions={{
              modifiers: [{ name: 'offset', options: { offset: [0, 8] } }]
            }}
          >
            {({ TransitionProps }) => (
              <Fade in={open} {...TransitionProps}>
                <motion.div variants={varSlide('slideInDown', { distance: 20 })} initial="initial" animate="animate" exit="exit">
                  <MainCard sx={{ borderRadius: 2, minWidth: 120, p: 0.5 }}>
                    <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                      <List disablePadding>
                        {themeModeData.map((item, index) => (
                          <ListItemButton
                            selected={mode === item.mode}
                            key={index}
                            sx={{ borderRadius: 2, p: 1 }}
                            onClick={() => onModeChange(item)}
                          >
                            <Stack direction="row" sx={{ gap: 1, alignItems: 'center' }}>
                              {item.icon} <Typography variant="body2">{item.title}</Typography>
                            </Stack>
                          </ListItemButton>
                        ))}
                      </List>
                    </ClickAwayListener>
                  </MainCard>
                </motion.div>
              </Fade>
            )}
          </Popper>
        </Activity>
      </AnimatePresence>
    </>
  );
}
