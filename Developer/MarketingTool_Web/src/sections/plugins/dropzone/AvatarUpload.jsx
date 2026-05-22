// @mui
import Button from '@mui/material/Button';

// @third-party
import { useForm } from 'react-hook-form';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import AvatarUpload from '@/components/third-party/dropzone/AvatarUpload';

/***************************  DROPZONE - AVATAR UPLOAD  ***************************/

export default function AvatarUploadDropzone() {
  const { control, handleSubmit, reset } = useForm({ defaultValues: { avatar: null } });

  const onAvatarSubmit = (data) => {
    console.log(data);
    reset();
  };

  return (
    <PresentationCard title="Drop Zone: Upload Avatar">
      <form onSubmit={handleSubmit(onAvatarSubmit)}>
        <AvatarUpload control={control} showDiscardAction />
        <Button variant="contained" type="submit" sx={{ mt: 5 }}>
          Submit
        </Button>
      </form>
    </PresentationCard>
  );
}
