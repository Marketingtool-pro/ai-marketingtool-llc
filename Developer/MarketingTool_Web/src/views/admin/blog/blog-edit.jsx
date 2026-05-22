import { useEffect, useRef, useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import ItemNotFound from '@/components/ItemNotFound';
import Loader from '@/components/Loader';
import PageAnimateWrapper from '@/components/PageAnimateWrapper';

import { BlogPost } from '@/sections/blog';
import { getBlog } from '@/sections/blog/api';
import { handlerBreadcrumbs } from '@/states/breadcrumbs';
import { useRouter } from '@/utils/navigation';

// @assets
import { IconArrowLeft, IconEye } from '@tabler/icons-react';

/***************************  BLOGS - EDIT  ***************************/

export default function BlogEdit() {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [preview, setPreview] = useState(false);
  const previewRef = useRef(null);

  const id = router.params.id;

  const handleClick = () => {
    if (previewRef.current) {
      previewRef.current.triggerFunction(); // Call the child function
    }
  };

  const handleButtonClick = () => {
    router.back();
  };

  const fetchBlogData = async () => {
    const { data, error } = await getBlog(id);

    if (data) setBlog(data);
    if (error) enqueueSnackbar(error, { variant: 'error' });
    setIsProcessing(false);
    return;
  };

  useEffect(() => {
    if (!id) return;

    handlerBreadcrumbs(`/blog/edit/${id}`, [{ title: 'blog', url: '/blog' }, { title: 'edit' }]);
    fetchBlogData();
    // eslint-disable-next-line
  }, [id]);

  if (isProcessing) return <Loader />;

  return (
    <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
          <IconButton onClick={handleButtonClick} color="secondary" variant="outlined" aria-label="back">
            <IconArrowLeft />
          </IconButton>
          <Typography variant="h6">Edit Blog & post</Typography>
        </Stack>
        {blog && (
          <Button variant="outlined" color="secondary" startIcon={<IconEye size={16} />} onClick={handleClick}>
            Preview
          </Button>
        )}
      </Stack>
      <PageAnimateWrapper>
        {blog ? (
          <BlogPost {...{ setPreview, preview, ref: previewRef, blogData: blog }} />
        ) : (
          <ItemNotFound heading="Blog Not Found" caption="The blog you are looking for does not exist or may have been removed." />
        )}
      </PageAnimateWrapper>
    </Stack>
  );
}
