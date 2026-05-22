import PropTypes from 'prop-types';
// @mui
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { useController } from 'react-hook-form';

// @project
import SettingCard from '@/components/cards/SettingCard';
import { trimOnBlur } from '@/utils/validation-schema/settings/plan';

/***************************  PLAN - OPTIONAL FIELD LABEL  ***************************/

function OptionalFieldLabel({ label }) {
  return (
    <Stack direction="row" component={InputLabel} sx={{ gap: 0.5 }}>
      {label}
      <Typography variant="body2" color="text.secondary">
        (Optional)
      </Typography>
    </Stack>
  );
}

/*************************** PRICING - GENERAL   ***************************/

export default function General({ control, nameSchema }) {
  const listStyle = { p: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 };

  const useFormField = (fieldName, control, rules = {}) => {
    const {
      field,
      fieldState: { error }
    } = useController({ name: fieldName, control, rules });

    return { field, error };
  };

  const name = useFormField('name', control, nameSchema);
  const description = useFormField('description', control);
  const isRecommended = useFormField('isRecommended', control);

  return (
    <SettingCard title="General" caption="Find essential settings and options to customize your experience.">
      <List disablePadding>
        <ListItem sx={listStyle} divider>
          <Box sx={{ width: 1 }}>
            <InputLabel>Plan Name</InputLabel>
            <OutlinedInput
              {...name.field}
              fullWidth
              placeholder="Enter your plan name"
              error={!!name.error}
              onBlur={trimOnBlur(name.field.onBlur, name.field.onChange)}
            />
            {name.error && <FormHelperText error>{name.error.message}</FormHelperText>}
          </Box>
        </ListItem>

        <ListItem sx={{ ...listStyle }} divider>
          <List disablePadding sx={{ width: 1 }}>
            <Box>
              <OptionalFieldLabel label="Description" />
              <OutlinedInput
                {...description.field}
                placeholder="Enter plan description"
                multiline
                minRows={5.5}
                aria-describedby="outlined-discription"
                fullWidth
                slotProps={{ input: { 'aria-label': 'discription' } }}
                onBlur={trimOnBlur(description.field.onBlur, description.field.onChange)}
              />
              <FormHelperText>Description will showcase in pricing card under the pricing name </FormHelperText>
            </Box>
          </List>
        </ListItem>

        <ListItem sx={listStyle}>
          <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, width: 1 }}>
            <Stack sx={{ gap: 1 }}>
              <Typography variant="body1">Set as Recommended</Typography>
              <Typography variant="body2" color="grey.700">
                By enabling this it will add recommended tag in pricing plan{' '}
              </Typography>
            </Stack>
            <Switch checked={!!isRecommended.field.value} onChange={(e) => isRecommended.field.onChange(e.target.checked)} />
          </Stack>
        </ListItem>
      </List>
    </SettingCard>
  );
}

OptionalFieldLabel.propTypes = { label: PropTypes.string };

General.propTypes = { control: PropTypes.object, nameSchema: PropTypes.object };
