import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import Autocomplete from '@mui/material/Autocomplete';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import Modal from '@/components/Modal';
import { ModalSize } from '@/enum';

// @assets
import { IconPointFilled } from '@tabler/icons-react';

const languageList = ['English', 'Spanish', 'German'];

/*************************** INTERNATIONALIZATION - ADD LANGUAGE MODAL  ***************************/

export default function AddLanguageModal({ open, onClose, selectedTags, setSelectedTags }) {
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
        header={{ title: 'Add Language', subheader: 'Select and manage your preferred language settings easily.', closeButton: true }}
        modalContent={
          <Grid container spacing={1.5}>
            <Grid size={12}>
              <InputLabel>Language</InputLabel>
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
              />
            </Grid>
            <Grid size={12}>
              {[
                'All content requires translation for Added language, including store content you have added, checkout, and theme text.',
                'Languages are not visible to customers until they are published.'
              ].map((item, index) => (
                <Box key={index} sx={{ ml: 0.25 }}>
                  <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 0.5, color: 'grey.700' }}>
                    <Box sx={{ width: 12, height: 12, mt: -0.125 }}>
                      <IconPointFilled size={10} />
                    </Box>
                    <Typography variant="caption">{item}</Typography>
                  </Stack>
                </Box>
              ))}
            </Grid>
          </Grid>
        }
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              Add Language
            </Button>
          </Stack>
        }
      />
    </>
  );
}

AddLanguageModal.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  selectedTags: PropTypes.bool,
  setSelectedTags: PropTypes.func
};
