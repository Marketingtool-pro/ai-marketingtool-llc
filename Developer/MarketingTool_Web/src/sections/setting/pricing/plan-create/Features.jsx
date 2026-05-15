import PropTypes from 'prop-types';
// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Checkbox from '@mui/material/Checkbox';
import FormHelperText from '@mui/material/FormHelperText';
import InputLabel from '@mui/material/InputLabel';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import TextField from '@mui/material/TextField';

// @project
import SettingCard from '@/components/cards/SettingCard';
import MainCard from '@/components/MainCard';
import { features } from '../data/features-data';

// @assets
import { useController } from 'react-hook-form';

/*************************** FEATURES ***************************/

export default function Features({ control, featuresSchema }) {
  const useFormField = (fieldName, control, rules = {}) => {
    const {
      field,
      fieldState: { error }
    } = useController({ name: fieldName, control, rules });

    return { field, error };
  };

  const featuresField = useFormField('features', control, featuresSchema);

  return (
    <SettingCard title="Features" caption="Explore powerful features designed to streamline your workflow.">
      <Stack sx={{ p: { xs: 2, sm: 3 }, gap: 1 }}>
        <Stack sx={{ width: 1 }}>
          <InputLabel>Features</InputLabel>
          <Autocomplete
            {...featuresField.field}
            multiple
            options={features}
            disableCloseOnSelect
            value={features.filter((opt) => featuresField.field.value?.some((f) => f.id === opt.id))}
            onChange={(_event, newValue) => {
              const updated = newValue.map((item) => {
                const existing = featuresField.field.value?.find((f) => f.id === item.id);
                return existing || { id: item.id, value: '', link: '' };
              });
              featuresField.field.onChange(updated);
            }}
            getOptionLabel={(option) => option.name}
            isOptionEqualToValue={(option, value) => option.id === value.id}
            slotProps={{ chip: { clickable: true, variant: 'tag', size: 'small', sx: { margin: 0.25 } } }}
            renderOption={(props, option, { selected }) => {
              const { key, ...optionProps } = props;
              return (
                <li key={key} {...optionProps}>
                  <Stack direction="row" sx={{ alignItems: 'center', gap: 0.75 }}>
                    <Checkbox checked={selected} sx={{ p: 0 }} />
                    {option.name}
                  </Stack>
                </li>
              );
            }}
            renderInput={(params) => <TextField {...params} placeholder="Select features" error={!!featuresField.error} />}
            sx={{ width: 1 }}
          />
          {featuresField.error && <FormHelperText error>{featuresField.error.message}</FormHelperText>}
        </Stack>
        {featuresField.field.value.length > 0 && (
          <MainCard sx={{ p: 0, width: 1 }}>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Title</TableCell>
                    <TableCell>Value</TableCell>
                    <TableCell>Reference Link</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {featuresField.field.value?.map((item, index) => {
                    const featureName = features.find((f) => f.id === item.id)?.name || 'Unknown';
                    return (
                      <TableRow key={item.id}>
                        <TableCell>{featureName}</TableCell>
                        <TableCell>
                          <OutlinedInput
                            aria-describedby="outlined-value"
                            fullWidth
                            slotProps={{ input: { 'aria-label': 'value' } }}
                            value={item.value}
                            placeholder="Feature value"
                            onChange={(e) => {
                              const updated = [...featuresField.field.value];
                              updated[index].value = e.target.value;
                              featuresField.field.onChange(updated);
                            }}
                          />
                        </TableCell>
                        <TableCell>
                          <OutlinedInput
                            aria-describedby="outlined-link"
                            fullWidth
                            slotProps={{ input: { 'aria-label': 'link' } }}
                            value={item.link}
                            placeholder="https://www.saasable.io"
                            onChange={(e) => {
                              const updated = [...featuresField.field.value];
                              updated[index].link = e.target.value;
                              featuresField.field.onChange(updated);
                            }}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </MainCard>
        )}
      </Stack>
    </SettingCard>
  );
}

Features.propTypes = { control: PropTypes.object, featuresSchema: PropTypes.object };
