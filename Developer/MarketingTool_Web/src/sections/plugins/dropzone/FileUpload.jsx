// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import SingleFileUpload from '@/components/third-party/dropzone/SingleFile';

/***************************  DROPZONE - FILE UPLOAD  ***************************/

export default function FileUpload() {
  const { control, handleSubmit, reset } = useForm({ defaultValues: { file: { name: '', size: 0, url: '' } } });

  const onSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <PresentationCard title="Drop Zone: Upload File">
      <form onSubmit={handleSubmit(onSubmit)}>
        <Stack sx={{ gap: 2 }}>
          <SingleFileUpload
            control={control}
            name="file"
            // custom placeholder
            placeholder={{
              label: (
                <>
                  <Typography variant="subtitle2" component="span" sx={{ color: 'primary.main' }}>
                    Upload your file{' '}
                  </Typography>
                  or drag and drop
                </>
              ),
              caption: 'Upload an image in SVG, PNG, JPG, or GIF format (max size: 800x400 px).'
            }}
          />
          <Button variant="contained" onClick={handleSubmit(onSubmit)} sx={{ alignSelf: 'flex-end' }}>
            Submit
          </Button>
        </Stack>
      </form>
    </PresentationCard>
  );
}
