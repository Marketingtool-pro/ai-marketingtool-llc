// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import {
  AddressInput,
  CopyLinkInput,
  ContactInput,
  CurrencyInput,
  EmailInput,
  IndustryInput,
  InputWithHelperText,
  TagInput,
  VerificationCode
} from '@/sections/components/input';

/***************************  INPUTS - INPUT  ***************************/

export default function InputsInput() {
  return (
    <ComponentsWrapper title="Input">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <EmailInput />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <ContactInput />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <CurrencyInput />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <CopyLinkInput />
        </Grid>
        <Grid size={{ xs: 12, md: 6 }}>
          <TagInput />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <AddressInput />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <InputWithHelperText />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <Grid size={12} mb={{ xs: 2, sm: 3 }}>
            <VerificationCode />
          </Grid>
          <Grid size={12}>
            <IndustryInput />
          </Grid>
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
