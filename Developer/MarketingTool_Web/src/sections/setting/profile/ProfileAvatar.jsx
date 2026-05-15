import PropTypes from 'prop-types';
import { useEffect, useTransition } from 'react';

// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// @third-party
import { enqueueSnackbar } from 'notistack';
import { useForm } from 'react-hook-form';

// @project
import AvatarUpload from '@/components/third-party/dropzone/AvatarUpload';

const initialData = {
  avatar: ''
};

/***************************  PROFILE - AVATAR  ***************************/

export default function ProfileAvatar({ avatar }) {
  const [isProcessing, startTransition] = useTransition();

  const {
    handleSubmit,
    control,
    reset,
    formState: { isDirty, dirtyFields, defaultValues }
  } = useForm({ defaultValues: initialData });

  const onSubmit = ({ avatar }) => {
    startTransition(async () => {
      try {
        const { appwriteAccount, appwriteStorage, ID } = await import('@/utils/auth-client/appwrite');

        let avatarUrl = avatar;
        if (avatar instanceof File) {
          // Upload to Appwrite Storage, save URL in prefs
          const bucketId = 'avatars';
          try {
            const file = await appwriteStorage.createFile(bucketId, ID.unique(), avatar);
            avatarUrl = `https://api.marketingtool.pro/v1/storage/buckets/${bucketId}/files/${file.$id}/view?project=6952c8a0002d3365625d`;
          } catch {
            // If storage bucket doesn't exist, just skip avatar upload
            enqueueSnackbar('Avatar storage not configured yet. Contact support.', { variant: 'warning' });
            return;
          }
        }

        const prefs = await appwriteAccount.getPrefs();
        await appwriteAccount.updatePrefs({ ...prefs, avatar: avatarUrl });
        enqueueSnackbar('Profile photo has been saved.', { variant: 'success' });
      } catch (err) {
        enqueueSnackbar(err?.message || 'Failed to save profile photo.', { variant: 'error' });
      }
    });
  };

  useEffect(() => {
    const formInitData = avatar ? { avatar: avatar } : initialData;
    reset(formInitData);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [avatar]);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <Stack direction="row" sx={{ width: 1, gap: 2, alignItems: 'start', justifyContent: 'space-between' }}>
        <AvatarUpload control={control} showDiscardAction={!!dirtyFields.avatar} initialAvatar={defaultValues?.avatar} />
        <Button
          variant="outlined"
          color="secondary"
          size="small"
          type="submit"
          disabled={!isDirty}
          {...(isProcessing && { loading: true, loadingPosition: 'end' })}
        >
          Save Photo
        </Button>
      </Stack>
    </form>
  );
}

ProfileAvatar.propTypes = { avatar: PropTypes.string };
