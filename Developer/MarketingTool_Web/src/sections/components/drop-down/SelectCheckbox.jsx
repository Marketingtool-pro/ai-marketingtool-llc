import { useState } from 'react';

// @mui
import Checkbox from '@mui/material/Checkbox';
import Chip from '@mui/material/Chip';
import FormControl from '@mui/material/FormControl';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Select from '@mui/material/Select';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// Set height of options popper
const ITEM_HEIGHT = 38;
const ITEM_PADDING_TOP = 8;
const ITEM_DISPLAY = 5;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * ITEM_DISPLAY + ITEM_PADDING_TOP * 2
    }
  }
};

// @data
const names = [
  'Oliver Hansen',
  'Van Henry',
  'April Tucker',
  'Ralph Hubbard',
  'Omar Alexander',
  'Carlos Abbott',
  'Miriam Wagner',
  'Bradley Wilkerson',
  'Virginia Andrews',
  'Kelly Snyder'
];

/***************************  DROP-DOWN - SELECT CHECKBOX  ***************************/

export default function MultipleSelectCheckmarks() {
  const [personName, setPersonName] = useState([]);

  const handleChange = (event) => {
    const {
      target: { value }
    } = event;
    setPersonName(
      // On autofill we get a stringified value.
      typeof value === 'string' ? value.split(',') : value
    );
  };

  return (
    <FormControl sx={{ width: 1 }}>
      <Select
        labelId="demo-multiple-checkbox-label"
        id="demo-multiple-checkbox"
        multiple
        displayEmpty
        value={personName}
        onChange={handleChange}
        input={<OutlinedInput />}
        renderValue={(selected) => {
          if (selected.length === 0) {
            return (
              <Typography variant="body2" sx={{ color: 'grey.600' }}>
                Select Tag
              </Typography>
            );
          }
          return (
            <Stack direction="row" sx={{ flexWrap: 'wrap', gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} clickable={true} variant="tag" label={value} />
              ))}
            </Stack>
          );
        }}
        MenuProps={MenuProps}
      >
        <MenuItem disabled value="">
          <Typography variant="body2">Select Tag</Typography>
        </MenuItem>
        {names.map((name) => (
          <MenuItem key={name} value={name}>
            <ListItemIcon>
              <Checkbox size="small" checked={personName.indexOf(name) > -1} sx={{ p: 0 }} />
            </ListItemIcon>
            <ListItemText primary={name} />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
}
