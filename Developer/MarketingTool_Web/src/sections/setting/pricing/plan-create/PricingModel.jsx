import PropTypes from 'prop-types';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

// @third-party
import { useController } from 'react-hook-form';

// @project
import SettingCard from '@/components/cards/SettingCard';
import MainCard from '@/components/MainCard';
import { billingPeriodsOptions, pricingModals } from '../data/plan-data';

// @assets
import { IconMinus, IconPlus } from '@tabler/icons-react';

/***************************  PRICING - INPUT  ***************************/

function PricingInput({ value, onChange, error }) {
  const handleIncrement = () => onChange((value ?? 0) + 1);
  const handleDecrement = () => onChange(Math.max(0, (value ?? 0) - 1));

  return (
    <>
      <TextField
        value={value ?? 0}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
        error={!!error}
        helperText={error}
        slotProps={{
          input: {
            startAdornment: (
              <InputAdornment position="start" sx={{ p: 0.25, borderRadius: 1, '&:hover': { bgcolor: 'grey.100' } }}>
                <IconMinus onClick={handleDecrement} cursor="pointer" />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end" sx={{ p: 0.25, borderRadius: 1, '&:hover': { bgcolor: 'grey.100' } }}>
                <IconPlus onClick={handleIncrement} cursor="pointer" />
              </InputAdornment>
            ),
            sx: { width: 112 }
          },
          htmlInput: {
            sx: { textAlign: 'center' }
          }
        }}
        variant="outlined"
      />
    </>
  );
}

/***************************  PRICING - PRICING MODEL  ***************************/

export default function PricingModel({ control, priceModalSchema, pricingOptionsSchema }) {
  const listStyle = { p: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 };

  const useFormField = (fieldName, control, rules = {}) => {
    const {
      field,
      fieldState: { error }
    } = useController({ name: fieldName, control, rules });

    return { field, error };
  };

  const priceModal = useFormField('priceModal', control, priceModalSchema);
  const pricingOptionsField = useFormField('pricingOptions', control, pricingOptionsSchema);
  const trialPeriodDays = useFormField('trialPeriodDays', control);
  const yearlyDiscount = useFormField('yearlyDiscount', control);

  return (
    <SettingCard title="Pricing Model" caption="Choose a pricing model that fits your needs and budget effectively.">
      <List disablePadding>
        <ListItem sx={listStyle} divider>
          <Stack sx={{ width: 1 }}>
            <InputLabel>Pricing Model</InputLabel>
            <Autocomplete
              {...priceModal.field}
              options={pricingModals}
              value={pricingModals.find((item) => item.value === priceModal.field.value) || null}
              getOptionLabel={(option) => option.title || ''}
              isOptionEqualToValue={(option, value) => option.value === value?.value}
              renderOption={(props, option) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    {option.title}
                  </li>
                );
              }}
              onChange={(_event, newValue) => priceModal.field.onChange(newValue?.value || '')}
              renderInput={(params) => <TextField {...params} placeholder="Flat Prices" error={!!priceModal.error} />}
              sx={{ width: 1 }}
            />
            {priceModal.error && <FormHelperText error>{priceModal.error.message}</FormHelperText>}
          </Stack>
        </ListItem>

        <ListItem sx={listStyle} divider>
          <Stack sx={{ width: 1 }}>
            <InputLabel>Billing Periods</InputLabel>
            <Autocomplete
              multiple
              value={billingPeriodsOptions.filter((opt) => pricingOptionsField.field.value.some((item) => item.period === opt.value))}
              onChange={(_event, newValue) => {
                const updated = newValue.map((option) => {
                  const existing = pricingOptionsField.field.value.find((item) => item.period === option.value);
                  return {
                    period: option.value,
                    price: existing?.price ?? 0
                  };
                });
                pricingOptionsField.field.onChange(updated);
              }}
              options={billingPeriodsOptions}
              disableCloseOnSelect
              getOptionLabel={(option) => option.title}
              isOptionEqualToValue={(option, value) => option.title === value.title}
              slotProps={{ chip: { clickable: true, variant: 'tag', size: 'small', sx: { margin: 0.25 } } }}
              renderOption={(props, option, { selected }) => {
                const { key, ...optionProps } = props;
                return (
                  <li key={key} {...optionProps}>
                    <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                      <Checkbox checked={selected} sx={{ p: 0 }} />
                      {option.title}
                    </Stack>
                  </li>
                );
              }}
              renderInput={(params) => <TextField {...params} placeholder="Choose billing periods" error={!!pricingOptionsField.error} />}
              sx={{ width: 1 }}
            />
            {pricingOptionsField.error && <FormHelperText error>{pricingOptionsField.error.message}</FormHelperText>}
          </Stack>

          {pricingOptionsField.field.value.length > 0 && (
            <MainCard sx={{ p: 0, width: 1 }}>
              <TableContainer>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>Currency</TableCell>
                      {pricingOptionsField.field.value.map((item) => {
                        const val = billingPeriodsOptions.find((x) => x.value === item.period);
                        return val && <TableCell key={item.period}>{val.title} Price</TableCell>;
                      })}
                      <TableCell>Yearly Discount</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    <TableRow sx={{ height: 72 }}>
                      <TableCell sx={{ typography: 'subtitle2' }}>USD</TableCell>
                      {pricingOptionsField.field.value.map((element, index) => (
                        <TableCell key={index}>
                          <PricingInput
                            value={element.price}
                            onChange={(val) => {
                              const updated = [...pricingOptionsField.field.value];
                              updated[index].price = val;
                              pricingOptionsField.field.onChange(updated);
                            }}
                          />
                        </TableCell>
                      ))}
                      <TableCell>
                        <PricingInput
                          value={yearlyDiscount.field.value}
                          onChange={yearlyDiscount.field.onChange}
                          error={yearlyDiscount.error?.message}
                        />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
            </MainCard>
          )}
        </ListItem>

        <ListItem sx={listStyle}>
          <Stack>
            <InputLabel>Trial Period In Days</InputLabel>
            <PricingInput
              value={trialPeriodDays.field.value}
              onChange={trialPeriodDays.field.onChange}
              error={trialPeriodDays.error?.message}
            />
          </Stack>
        </ListItem>
      </List>
    </SettingCard>
  );
}

PricingInput.propTypes = { value: PropTypes.number, onChange: PropTypes.func, error: PropTypes.string };

PricingModel.propTypes = { control: PropTypes.object, priceModalSchema: PropTypes.object, pricingOptionsSchema: PropTypes.object };
