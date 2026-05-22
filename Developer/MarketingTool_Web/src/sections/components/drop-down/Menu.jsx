import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';

// @assets
import { IconCommand, IconCut, IconUser } from '@tabler/icons-react';

/***************************  DROP-DOWN - MENU  ***************************/

export default function BasicMenu() {
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <Button
        id="basic-button"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        With Menu
      </Button>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        slotProps={{ list: { 'aria-labelledby': 'basic-button' } }}
      >
        <MenuItem onClick={handleClose} selected>
          <ListItemIcon>
            <IconCut size={16} />
          </ListItemIcon>
          <ListItemText>Cut</ListItemText>
          <Typography variant="caption" className="MuiTypography-custom">
            <IconCommand size={20} />C
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>
          <ListItemIcon>
            <IconUser size={16} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
          <Typography variant="caption" className="MuiTypography-custom">
            <IconCommand size={20} />C
          </Typography>
        </MenuItem>
        <MenuItem selected>
          <ListItemIcon>
            <Checkbox defaultChecked size="small" sx={{ p: 0 }} />
          </ListItemIcon>
          <ListItemText>My Account</ListItemText>
          <Typography variant="caption" className="MuiTypography-custom">
            <IconCommand size={20} />C
          </Typography>
        </MenuItem>
        <MenuItem onClick={handleClose}>Logout</MenuItem>
      </Menu>
    </>
  );
}
