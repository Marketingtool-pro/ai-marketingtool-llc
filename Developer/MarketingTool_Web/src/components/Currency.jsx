import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Divider from '@mui/material/Divider';
import Fade from '@mui/material/Fade';
import InputAdornment from '@mui/material/InputAdornment';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import OutlinedInput from '@mui/material/OutlinedInput';
import Popper from '@mui/material/Popper';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import DynamicIcon from './DynamicIcon';

// @assets
import { IconChevronDown, IconHelp } from '@tabler/icons-react';

// @types

// @data
import currencies from '@/data/currencies';

/***************************  CURRENCY  ***************************/

export default function Currency({
  defaultCurrency,
  defaultAmount,
  placeholder = '00.00',
  helpText,
  isDisabled = false,
  isCurrencyDisabled = false,
  fullWidth = false,
  onCurrencyChange,
  onAmountChange
}) {
  const theme = useTheme();

  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);
  const [amount, setAmount] = useState(defaultAmount || '');

  const open = Boolean(anchorEl);
  const id = open ? 'currency-popper' : undefined;

  const handleClick = (event) => {
    setAnchorEl(anchorEl ? null : event.currentTarget);
  };

  useEffect(() => {
    if (defaultCurrency) {
      const data = currencies.find((item) => item.code === defaultCurrency);
      setSelectedCurrency(data || currencies[0]);
    }
  }, [defaultCurrency]);

  const currencyChange = (currency) => {
    setSelectedCurrency(currency);
    if (onCurrencyChange) {
      onCurrencyChange(currency);
    }
  };

  const amountChange = (val) => {
    setAmount(val);
    if (onAmountChange) {
      onAmountChange(val);
    }
  };

  return (
    <OutlinedInput
      placeholder={placeholder}
      disabled={isDisabled}
      value={amount}
      onChange={(e) => amountChange(e.target.value)}
      aria-describedby="currency-field"
      slotProps={{ input: { 'aria-label': 'currency' } }}
      startAdornment={
        <InputAdornment position="start">
          {selectedCurrency?.symbol && <DynamicIcon name={selectedCurrency.symbol} color={theme.vars.palette.text.secondary} />}
        </InputAdornment>
      }
      fullWidth={fullWidth}
      endAdornment={
        <Stack direction="row" sx={{ alignItems: 'center', height: 1, gap: 1.5, ml: 0.75 }}>
          {helpText && (
            <InputAdornment position="end" sx={{ '& svg': { cursor: 'default' } }}>
              <Tooltip title={helpText}>
                <IconHelp />
              </Tooltip>
            </InputAdornment>
          )}
          <Divider orientation="vertical" flexItem />
          <Button
            endIcon={<IconChevronDown width={16} height={16} />}
            disabled={isDisabled || isCurrencyDisabled}
            color="secondary"
            sx={{
              ...theme.typography.body2,
              height: 'auto',
              p: 0,
              borderRadius: 2,
              minWidth: 50,
              '&:hover': { bgcolor: 'transparent' },
              '&:before': { display: 'none' },
              '& .MuiInputBase-input:focus': { bgcolor: 'transparent' }
            }}
            disableRipple
            aria-describedby={id}
            type="button"
            onClick={handleClick}
          >
            {selectedCurrency?.code}
          </Button>
          <Popper
            placement="bottom-end"
            id={id}
            open={open}
            anchorEl={anchorEl}
            transition
            popperOptions={{ modifiers: [{ name: 'offset', options: { offset: [10, 11] } }] }}
            sx={{ zIndex: 1301 }}
          >
            {({ TransitionProps }) => (
              <Fade in={open} {...TransitionProps}>
                <Card elevation={0} sx={{ border: '1px solid', borderColor: theme.vars.palette.divider, borderRadius: 2 }}>
                  <ClickAwayListener onClickAway={() => setAnchorEl(null)}>
                    <Box sx={{ p: 0.5 }}>
                      <List disablePadding>
                        <Box sx={{ maxHeight: 320, width: 280, overflow: 'auto' }}>
                          {currencies.map((currency, index) => (
                            <ListItemButton
                              key={index}
                              sx={{
                                borderRadius: 2,
                                mb: 0.25,
                                ...theme.applyStyles('dark', {
                                  '&.Mui-selected': { span: { color: 'grey.600' } }
                                })
                              }}
                              selected={currency.code === selectedCurrency?.code}
                              onClick={() => currencyChange(currency)}
                            >
                              <ListItemText
                                primary={
                                  <Typography variant="body2">
                                    {currency.code} -{' '}
                                    <Typography component="span" color="grey.700">
                                      {currency.name}
                                    </Typography>
                                  </Typography>
                                }
                              />
                            </ListItemButton>
                          ))}
                        </Box>
                      </List>
                    </Box>
                  </ClickAwayListener>
                </Card>
              </Fade>
            )}
          </Popper>
        </Stack>
      }
    />
  );
}

Currency.propTypes = {
  defaultCurrency: PropTypes.any,
  defaultAmount: PropTypes.any,
  placeholder: PropTypes.string,
  helpText: PropTypes.any,
  isDisabled: PropTypes.bool,
  isCurrencyDisabled: PropTypes.bool,
  fullWidth: PropTypes.bool,
  onCurrencyChange: PropTypes.any,
  onAmountChange: PropTypes.any
};
