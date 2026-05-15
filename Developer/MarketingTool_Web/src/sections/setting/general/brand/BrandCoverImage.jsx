import { useCallback, useState } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @thrid-party
import { useDropzone } from 'react-dropzone';

// @project
import SettingCard from '@/components/cards/SettingCard';
import { AvatarSize } from '@/enum';

// @assets
import { IconUpload, IconTrash } from '@tabler/icons-react';

const dropWrapperStyle = {
  border: '1px dashed',
  borderColor: 'divider',
  p: 2,
  borderRadius: 2,
  textAlign: 'center',
  cursor: 'pointer'
};

/***************************  BRAND - COVER IMAGE  ***************************/

export default function BrandCoverImage() {
  const [uploadedImages, setUploadedImages] = useState([]);

  const onDrop = useCallback((acceptedFiles) => {
    const newImages = acceptedFiles.map((file) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        setUploadedImages((prev) => [
          ...prev,
          { url: reader.result, name: file.name, size: file.size / (1024 * 1024) } // Convert to MB
        ]);
      };
      return { url: '', name: file.name, size: file.size / (1024 * 1024) };
    });
    // Update state once all files are read
    Promise.all(newImages).then(() => {
      setUploadedImages((prev) => [...prev]);
    });
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']
    },
    multiple: true
  });

  const handleRemoveImage = (index) => {
    setUploadedImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <SettingCard title="Cover Image" caption="A great cover image can make a big difference.">
      <List disablePadding>
        <ListItem sx={{ p: { xs: 2, sm: 3 }, display: 'block' }}>
          <Typography variant="body2" sx={{ mb: uploadedImages ? 3 : 0.75 }}>
            Cover Images
          </Typography>
          <Stack sx={{ gap: 2 }}>
            {uploadedImages.length > 0 ? (
              uploadedImages.map((image, index) => (
                <Stack key={index} direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                  <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                    <Avatar src={image.url} alt={image.name} variant="rounded" size={AvatarSize.MD} />
                    {image.name && (
                      <Stack sx={{ gap: 1 }}>
                        <Typography variant="body2" color="textPrimary">
                          {image.name}
                        </Typography>
                        <Typography variant="body2" color="grey.700">
                          ({image.size?.toFixed(2)} MB)
                        </Typography>
                      </Stack>
                    )}
                  </Stack>
                  <IconButton onClick={() => handleRemoveImage(index)} color="error" aria-label="delete">
                    <IconTrash size={16} />
                  </IconButton>
                </Stack>
              ))
            ) : (
              <Box {...getRootProps()} sx={dropWrapperStyle}>
                <Stack sx={{ gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                  <input {...getInputProps()} />
                  <Avatar variant="rounded" size={AvatarSize.XS}>
                    <IconUpload size={16} />
                  </Avatar>
                  <Stack sx={{ gap: 0.5 }}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Typography variant="subtitle2" color="primary">
                        Click to Upload
                      </Typography>
                      <Typography variant="body2">Add a cover images</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ fontWeight: 400, color: 'text.disabled' }}>
                      HEIC, WEBP, SVG, PNG, or JPG. Recommended dimensions: 1920 × 1080 pixels minimum.
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            )}
          </Stack>
        </ListItem>
      </List>
    </SettingCard>
  );
}
