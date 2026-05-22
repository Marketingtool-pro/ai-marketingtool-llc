// @mui
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import Contact from '@/components/Contact';

/***************************  INPUT - CONTACT  ***************************/

export default function ContactInput() {
  const { watch, control, setValue } = useForm();
  const { watch: watch1, control: control1, setValue: setValue1 } = useForm({ defaultValues: { dialcode: '+91', contact: '987654321' } });

  return (
    <PresentationCard title="Contact Input">
      <Stack sx={{ gap: 2.5 }}>
        <Box>
          <InputLabel>Contact</InputLabel>
          <Contact
            helpText="Contact number"
            fullWidth
            control={control}
            dialCode={watch('dialcode')}
            onCountryChange={(data) => setValue('dialcode', data.dialCode)}
          />
        </Box>
        <Box>
          <InputLabel>Filled</InputLabel>
          <Contact
            helpText="Contact number"
            fullWidth
            control={control1}
            dialCode={watch1('dialcode')}
            onCountryChange={(data) => setValue1('dialcode', data.dialCode)}
          />
        </Box>
        <Box>
          <InputLabel>Disabled</InputLabel>
          <Contact helpText="Contact number" fullWidth isDisabled control={control} />
        </Box>
      </Stack>
    </PresentationCard>
  );
}
