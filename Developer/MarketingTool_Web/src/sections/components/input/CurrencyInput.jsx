// @mui
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import Currency from '@/components/Currency';

/***************************  INPUT - CURRENCY  ***************************/

export default function CurrencyInput() {
  const onCurrencyChange = (val) => {
    console.log(val);
  };

  const onAmountChange = (val) => {
    console.log(val);
  };

  return (
    <PresentationCard title="Currency Input">
      <Stack sx={{ gap: 2.5 }}>
        <Box>
          <InputLabel>Currency</InputLabel>
          <Currency helpText="Currency" fullWidth onCurrencyChange={onCurrencyChange} onAmountChange={onAmountChange} />
        </Box>
        <Box>
          <InputLabel>Filled</InputLabel>
          <Currency helpText="Currency" fullWidth defaultAmount="45690.90" />
        </Box>
        <Box>
          <InputLabel>Disabled</InputLabel>
          <Currency helpText="Currency" fullWidth isDisabled />
        </Box>
      </Stack>
    </PresentationCard>
  );
}
