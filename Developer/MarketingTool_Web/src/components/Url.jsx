import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

// @assets
import { IconCopy, IconHelp, IconWorld } from '@tabler/icons-react';

// @types

/***************************  URL FIELD  ***************************/

export default function UrlField({ defaultValue, placeholder = 'saasable.io', helpText, isDisabled = false, fullWidth = false }) {
  const theme = useTheme();

  const [value, setValue] = useState(defaultValue || '');

  const handleClick = () => {
    navigator.clipboard
      .writeText(value)
      .then(() => {})
      .catch((err) => {
        console.error('Failed to copy: ', err);
      });
  };

  return (
    <OutlinedInput
      placeholder={placeholder}
      disabled={isDisabled}
      value={value}
      onChange={(e) => setValue(e.target.value)}
      aria-describedby="link-field"
      slotProps={{ input: { 'aria-label': 'link' } }}
      fullWidth={fullWidth}
      startAdornment={
        <InputAdornment position="start">
          <IconWorld />
        </InputAdornment>
      }
      endAdornment={
        <Stack direction="row" sx={{ height: 1, gap: 1.25, alignItems: 'center', ml: 0.75 }}>
          {helpText && (
            <InputAdornment position="end" sx={{ '& svg': { cursor: 'default' } }}>
              <Tooltip title={helpText}>
                <IconHelp />
              </Tooltip>
            </InputAdornment>
          )}
          <Divider orientation="vertical" flexItem />
          <Button
            startIcon={<IconCopy width={16} height={16} />}
            disabled={isDisabled}
            color="secondary"
            sx={{
              ...theme.typography.body2,
              height: 'auto',
              p: 0,
              borderRadius: 2,
              minWidth: 56,
              '&:hover': { bgcolor: 'transparent' },
              '&:before': { display: 'none' },
              '& .MuiInputBase-input:focus': { bgcolor: 'transparent' }
            }}
            disableRipple
            aria-describedby="copy-link"
            type="button"
            onClick={handleClick}
          >
            Copy
          </Button>
        </Stack>
      }
    />
  );
}

UrlField.propTypes = {
  defaultValue: PropTypes.any,
  placeholder: PropTypes.string,
  helpText: PropTypes.any,
  isDisabled: PropTypes.bool,
  fullWidth: PropTypes.bool
};
