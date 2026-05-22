// @mui
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import CodeVerification from '@/components/CodeVerification';
import MainCard from '@/components/MainCard';

/***************************  INPUT - VARIFICATION CODE  ***************************/

export default function VarificationCode() {
  const { control: otpControl } = useForm();

  return (
    <MainCard>
      <InputLabel>Verification Code</InputLabel>
      <CodeVerification control={otpControl} />
      <FormHelperText>This is a hint text to help user.</FormHelperText>
    </MainCard>
  );
}
