import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';

const languageList = ['English', 'Spanish', 'German'];

/*************************** INTERNATIONALIZATION - EXPORT LANGUAGE ***************************/

export default function ExportLanguage({ open, onClose, selectedTags, setSelectedTags }) {
  const [value, setValue] = useState(selectedTags ? 'true' : '');

  const { handleSubmit, reset } = useForm();

  const onSubmit = (data) => {
    console.log(data);
    reset();
    onClose();
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        maxWidth={ModalSize.MD}
        header={{ title: 'Export Language', subheader: 'Export your language settings for backup or use elsewhere', closeButton: true }}
        modalContent={
          <Stack sx={{ gap: 3 }}>
            <Stack sx={{ gap: 0.75 }}>
              <Typography variant="body2">Language</Typography>
              <Autocomplete
                options={languageList}
                value={value}
                onChange={(_event, newValue) => {
                  if (typeof newValue === 'string') {
                    setValue(newValue);
                    if (setSelectedTags) setSelectedTags(newValue);
                  }
                }}
                disableClearable
                renderOption={(props, option) => {
                  const { key, ...optionProps } = props;
                  return (
                    <li key={key} {...optionProps}>
                      {option}
                    </li>
                  );
                }}
                renderInput={(params) => <TextField {...params} placeholder="Select Language" />}
                sx={{ width: 1 }}
              />
            </Stack>
            <Stack sx={{ gap: 1 }}>
              <Typography variant="subtitle1">Content</Typography>
              <RadioGroup row aria-labelledby="radio-content" defaultValue={1} name="radio-content" sx={{ color: 'text.secondary' }}>
                <FormControlLabel control={<Radio value={0} size="large" />} label=" All" />
                <FormControlLabel control={<Radio value={1} size="large" />} label="Selected content" />
              </RadioGroup>
            </Stack>
            <Stack sx={{ gap: 1 }}>
              <Typography variant="subtitle1">File</Typography>
              <RadioGroup aria-labelledby="radio-file" defaultValue={1} name="radio-file" sx={{ color: 'text.secondary' }}>
                <FormControlLabel
                  control={<Radio value={0} size="large" />}
                  label="CSV for Excel, Numbers, or another spreadsheet program"
                />
                <FormControlLabel control={<Radio value={1} size="large" />} label="CSV for text editors" />
              </RadioGroup>
            </Stack>
          </Stack>
        }
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              Export
            </Button>
          </Stack>
        }
      />
    </>
  );
}

ExportLanguage.propTypes = { open: PropTypes.bool, onClose: PropTypes.func, selectedTags: PropTypes.bool, setSelectedTags: PropTypes.func };
