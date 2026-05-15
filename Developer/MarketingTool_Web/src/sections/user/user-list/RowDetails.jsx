import PropTypes from 'prop-types';
// @mui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/***************************  TABLE - ROW DETAILS  ***************************/

export default function RowDetails({ data }) {
  return (
    <Grid container columns={12} rowSpacing={{ xs: 2, sm: 3, md: 4 }} columnSpacing={{ xs: 2, sm: 3, md: 5 }}>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Email Address
          </Typography>
          <Typography variant="subtitle2">{data.email}</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Contact No.
          </Typography>
          <Typography variant="subtitle2">{`${data.dialCode} ${data.contact}`}</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Zip code
          </Typography>
          <Typography variant="subtitle2">{data.zipCode || 'N/A'}</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Address
          </Typography>
          <Typography variant="subtitle2">{data.address || 'N/A'}</Typography>
        </Stack>
      </Grid>
      <Grid size={{ xs: 12, sm: 4 }}>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="caption" sx={{ color: 'grey.700' }}>
            Last Login date
          </Typography>
          <Typography variant="subtitle2">{data.loginDate || 'N/A'}</Typography>
        </Stack>
      </Grid>
    </Grid>
  );
}

RowDetails.propTypes = { data: PropTypes.any };
