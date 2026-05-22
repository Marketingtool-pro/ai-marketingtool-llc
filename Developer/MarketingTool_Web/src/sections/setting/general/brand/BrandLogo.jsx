import { useCallback, useState } from 'react';

// @mui
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @third-party
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

/***************************  BRAND - LOGO  ***************************/

export default function BrandLogo() {
  // default logo state and handlers
  const [defaultImage, setDefaultImage] = useState(null);
  const [fileName, setFileName] = useState(null);
  const [fileSize, setFileSize] = useState(null);

  const onDropDefault = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setDefaultImage(reader.result);
        setFileName(file.name);
        setFileSize(file.size / (1024 * 1024)); // Convert bytes to MB
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps, getInputProps } = useDropzone({
    onDrop: onDropDefault,
    accept: {
      image: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']
    },
    multiple: false
  });

  const handleRemoveDefaultImage = () => {
    setDefaultImage(null);
    setFileName(null);
    setFileSize(null);
  };

  // square logo state and handlers
  const [squareImage, setSquareImage] = useState(null);
  const [fileNameSquare, setFileNameSquare] = useState(null);
  const [fileSizeSquare, setFileSizeSquare] = useState(null);

  const onDropSquare = useCallback((acceptedFiles) => {
    const file = acceptedFiles[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setSquareImage(reader.result);
        setFileNameSquare(file.name); // Set square file name
        setFileSizeSquare(file.size / (1024 * 1024)); // Convert bytes to MB
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const { getRootProps: getRootSquareProps, getInputProps: getInputSquareProps } = useDropzone({
    onDrop: onDropSquare,
    accept: {
      image: ['.png', '.jpg', '.jpeg', '.gif', '.svg', '.webp']
    },
    multiple: false
  });

  const handleRemoveSquareImage = () => {
    setSquareImage(null);
    setFileNameSquare(null);
    setFileSizeSquare(null);
  };

  return (
    <SettingCard title="Logo" caption="Used for most common logo applications">
      <List disablePadding>
        {/* Default logo section */}
        <ListItem sx={{ p: { xs: 2, sm: 3 }, display: 'block' }} divider>
          <Typography variant="body2" sx={{ mb: defaultImage ? 3 : 0.75 }}>
            Default Logo
          </Typography>
          <Stack sx={{ gap: 2 }}>
            {defaultImage ? (
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                  <Avatar src={defaultImage} alt="Uploaded Logo" variant="rounded" size={AvatarSize.MD} />
                  {fileName && (
                    <Stack sx={{ gap: 1 }}>
                      <Typography variant="body2" color="textPrimary">
                        {fileName}
                      </Typography>
                      <Typography variant="body2" color="grey.700">
                        ({fileSize?.toFixed(2)} MB)
                      </Typography>
                    </Stack>
                  )}
                </Stack>
                <IconButton onClick={handleRemoveDefaultImage} color="error" aria-label="delete">
                  <IconTrash size={16} />
                </IconButton>
              </Stack>
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
                      <Typography variant="body2">Add a default logo</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ fontWeight: 400, color: 'text.disabled' }}>
                      HEIC, WEBP, SVG, PNG, or JPG. Recommended width: 512 pixels minimum.
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            )}
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Used for most common logo applications
            </Typography>
          </Stack>
        </ListItem>

        {/* Square logo section */}
        <ListItem sx={{ p: { xs: 2, sm: 3 }, display: 'block' }}>
          <Typography variant="body2" sx={{ mb: squareImage ? 3 : 0.75 }}>
            Square Logo
          </Typography>
          <Stack sx={{ gap: 2 }}>
            {squareImage ? (
              <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
                <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                  <Avatar src={squareImage} alt="Uploaded Square Logo" variant="rounded" size={AvatarSize.MD} />
                  {fileNameSquare && (
                    <Stack sx={{ gap: 1 }}>
                      <Typography variant="body2" color="textPrimary">
                        {fileNameSquare}
                      </Typography>
                      <Typography variant="body2" color="grey.700">
                        ({fileSizeSquare?.toFixed(2)} MB)
                      </Typography>
                    </Stack>
                  )}
                </Stack>
                <IconButton onClick={handleRemoveSquareImage} color="error" aria-label="delete">
                  <IconTrash size={16} />
                </IconButton>
              </Stack>
            ) : (
              <Box {...getRootSquareProps()} sx={dropWrapperStyle}>
                <Stack sx={{ gap: 2, justifyContent: 'center', alignItems: 'center' }}>
                  <input {...getInputSquareProps()} />
                  <Avatar variant="rounded" size={AvatarSize.XS}>
                    <IconUpload size={16} />
                  </Avatar>
                  <Stack sx={{ gap: 0.5 }}>
                    <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'center', gap: 0.5 }}>
                      <Typography variant="subtitle2" color="primary">
                        Click to Upload
                      </Typography>
                      <Typography variant="body2">Add a square logo</Typography>
                    </Stack>
                    <Typography variant="caption" sx={{ fontWeight: 400, color: 'text.disabled' }}>
                      HEIC, WEBP, SVG, PNG, or JPG. Recommended dimensions: 512 x 512 pixels minimum.
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            )}
            <Typography variant="caption" sx={{ color: 'text.disabled' }}>
              Used for square logo applications.
            </Typography>
          </Stack>
        </ListItem>
      </List>
    </SettingCard>
  );
}
