import { useState } from 'react';

// @mui
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @assets
import { IconCommand, IconCut, IconUser } from '@tabler/icons-react';

/***************************  DROP-DOWN - SELECT  ***************************/

export default function BasicSelect() {
  const [age, setAge] = useState('Cut');

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  return (
    <Stack sx={{ gap: 0.25 }}>
      <InputLabel>Select</InputLabel>
      <FormControl fullWidth>
        <Select
          id="demo-simple-select"
          value={age}
          onChange={handleChange}
          renderValue={(selected) => {
            return selected;
          }}
        >
          <MenuItem value="Cut">
            <ListItemIcon>
              <IconCut size={16} />
            </ListItemIcon>
            <ListItemText>Cut</ListItemText>
            <Typography variant="caption" className="MuiTypography-custom">
              <IconCommand size={20} />C
            </Typography>
          </MenuItem>
          <MenuItem value="My Account">
            <ListItemIcon>
              <IconUser size={16} />
            </ListItemIcon>
            <ListItemText>My Account</ListItemText>
            <Typography variant="caption" className="MuiTypography-custom">
              <IconCommand size={20} />C
            </Typography>
          </MenuItem>
          <MenuItem value="Logout">Logout</MenuItem>
        </Select>
      </FormControl>
    </Stack>
  );
}
