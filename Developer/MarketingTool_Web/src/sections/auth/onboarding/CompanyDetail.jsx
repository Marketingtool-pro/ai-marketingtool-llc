import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import Autocomplete from '@mui/material/Autocomplete';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @types

const industryName = ['SaaS', 'eCommerce', 'Finance', 'Education'];
const teamSize = ['2-25', '26 - 200', '201 - 500', '501 - 5000', '5001+', 'It’s just me'];

/***************************  AUTH - COMPANY DETAIL  ***************************/

export default function CompanyDetail({ inputSx }) {
  const theme = useTheme();

  // Set default selected value as the first item
  const [selectedIndustry, setSelectedIndustry] = useState(industryName[0]);

  return (
    <Stack sx={{ gap: 5 }}>
      <Stack sx={{ gap: 1.5, alignItems: 'center' }}>
        <Typography variant="h3">Company Details</Typography>
        <Typography variant="body2" sx={{ color: 'text.secondary' }}>
          Enter and manage your company&apos;s essential details and key information.
        </Typography>
      </Stack>
      <form autoComplete="off">
        <Grid container rowSpacing={2.5} columnSpacing={1.5}>
          <Grid size={12}>
            <InputLabel>Company Name</InputLabel>
            <OutlinedInput placeholder="Enter company name" fullWidth sx={{ ...inputSx }} />
          </Grid>
          <Grid size={12}>
            <InputLabel sx={{ display: 'flex' }}>
              Project Name
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                (Optional)
              </Typography>
            </InputLabel>
            <OutlinedInput placeholder="Enter project name" fullWidth sx={{ ...inputSx }} />
          </Grid>
          <Grid size={12}>
            <InputLabel sx={{ display: 'flex' }}>
              Company website
              <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                (Optional)
              </Typography>
            </InputLabel>
            <OutlinedInput placeholder="Enter website name" fullWidth sx={{ ...inputSx }} />
          </Grid>
          <Grid size={12}>
            <InputLabel>Team Size</InputLabel>
            <RadioGroup aria-labelledby="radio-group-label-small" defaultValue={teamSize[0]} name="radio-group-label-small">
              <Grid container spacing={0.75}>
                {teamSize.map((item, index) => (
                  <Grid key={index} size={{ xs: 6 }}>
                    <FormControlLabel
                      control={<Radio value={item} />}
                      sx={{
                        p: 0.5,
                        borderRadius: 2,
                        border: '1px solid',
                        borderColor: 'divider',
                        boxShadow: theme.vars.customShadows.button,
                        alignItems: 'center',
                        ml: 0,
                        width: 1
                      }}
                      label={item}
                    />
                  </Grid>
                ))}
              </Grid>
            </RadioGroup>
          </Grid>
          <Grid size={12}>
            <InputLabel>Industry</InputLabel>
            <Autocomplete
              options={industryName}
              value={selectedIndustry}
              onChange={(_event, newValue) => setSelectedIndustry(newValue)}
              getOptionLabel={(option) => option}
              isOptionEqualToValue={(option, value) => option === value}
              renderOption={({ key: optionKey, ...optionProps }, option) => (
                <li key={optionKey} {...optionProps}>
                  {option}
                </li>
              )}
              renderInput={(params) => <TextField {...params} placeholder="Select Items" />}
              slotProps={{ clearIndicator: { sx: { width: 32, height: 32 } } }}
              sx={{ width: 1 }}
            />
          </Grid>
        </Grid>
      </form>
    </Stack>
  );
}

CompanyDetail.propTypes = { inputSx: PropTypes.any };
