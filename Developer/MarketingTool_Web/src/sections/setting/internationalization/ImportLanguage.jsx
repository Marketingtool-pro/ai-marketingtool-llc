import PropTypes from 'prop-types';
// @mui
import Button from '@mui/material/Button';
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import Modal from '@/components/Modal';
import SingleFileUpload from '@/components/third-party/dropzone/SingleFile';
import { ModalSize } from '@/enum';

/*************************** INTERNATIONALIZATION - IMPORT LANGUAGE ***************************/

export default function ImportLanguage({ open, onClose }) {
  const { control, handleSubmit, setValue, reset } = useForm({
    defaultValues: { file: { name: '', size: 0, url: '' }, overwrite: true }
  });

  const handleClose = () => {
    reset();
    onClose();
  };

  const onSubmit = (data) => {
    console.log(data);
    reset();
    onClose();
  };

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        maxWidth={ModalSize.MD}
        header={{ title: 'Import Language', subheader: 'Import language settings quickly to match your preferences.', closeButton: true }}
        modalContent={
          <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={{ xs: 1.5, md: 2.5 }}>
              <Grid size={12}>
                <InputLabel>Translation File</InputLabel>
                <SingleFileUpload
                  control={control}
                  name="file"
                  placeholder={{
                    label: (
                      <>
                        <Typography variant="subtitle2" component="span" sx={{ color: 'primary.main' }}>
                          Add file{' '}
                        </Typography>
                        or drag and drop
                      </>
                    ),
                    caption: 'To import a language, upload a CSV file of your translations'
                  }}
                />
              </Grid>
              <Grid size={12}>
                <FormControlLabel
                  control={<Checkbox size="large" name="overwrite" onChange={(e) => setValue('overwrite', e.target.checked)} />}
                  label="Overwrite any existing translations for this language"
                  sx={{ color: 'text.secondary' }}
                />
              </Grid>
            </Grid>
          </form>
        }
        footer={
          <Stack direction="row" sx={{ width: 1, justifyContent: 'space-between', gap: 2 }}>
            <Button variant="outlined" color="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit(onSubmit)}>
              Import
            </Button>
          </Stack>
        }
      />
    </>
  );
}

ImportLanguage.propTypes = { open: PropTypes.bool, onClose: PropTypes.func };
