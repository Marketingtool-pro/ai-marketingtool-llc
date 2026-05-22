import { useRef, useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import { BlogPost } from '@/sections/blog';
import { useRouter } from '@/utils/navigation';

// @assets
import { IconArrowLeft, IconEye } from '@tabler/icons-react';

/***************************  BLOGS - CREATE  ***************************/

export default function BlogCreate() {
  const router = useRouter();
  const [preview, setPreview] = useState(false);

  const previewRef = useRef(null);

  const handleClick = () => {
    if (previewRef.current) {
      previewRef.current.triggerFunction(); // Call the child function "BlogPost" component
    }
  };

  const handleButtonClick = () => {
    router.back();
  };

  return (
    <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
          <IconButton onClick={handleButtonClick} color="secondary" variant="outlined" aria-label="back">
            <IconArrowLeft />
          </IconButton>
          <Typography variant="h6">Post New Blog</Typography>
        </Stack>
        <Button variant="outlined" color="secondary" startIcon={<IconEye size={16} />} disabled={!preview} onClick={handleClick}>
          Preview
        </Button>
      </Stack>
      <BlogPost {...{ setPreview, preview, ref: previewRef }} />
    </Stack>
  );
}
