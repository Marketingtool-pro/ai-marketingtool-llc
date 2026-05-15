import PropTypes from 'prop-types';
// @mui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import TagList from '@/components/third-party/table/TagList';

// @types
import { BillingCycle } from '@/sections/account/type';

/***************************  TABLE - ROW DETAILS  ***************************/

export default function RowDetails({ data }) {
  return (
    <Grid container rowSpacing={{ xs: 2, sm: 3, md: 4 }} columnSpacing={{ xs: 2, sm: 3, md: 5 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Email Address
          </Typography>
          <Typography variant="subtitle2">{data.profile.email}</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Contact No.
          </Typography>
          <Typography variant="subtitle2">{`${data.profile.dialCode} ${data.profile.contact}`}</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Plan
          </Typography>
          <Typography variant="subtitle2">{data.plan.name}</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 8 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Features
          </Typography>
          <TagList
            list={data.plan.features.map((feature) => feature.label)}
            typographyProps={{ variant: 'subtitle2', color: 'text.primary' }}
          />
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Pricing
          </Typography>
          <Typography variant="subtitle2">
            ${data.billingCycle === BillingCycle.YEARLY ? data.plan.yearlyPrice : data.plan.monthlyPrice} USD
          </Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}

RowDetails.propTypes = { data: PropTypes.any };
