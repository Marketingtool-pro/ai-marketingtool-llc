import { useEffect, useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @third-party
import { enqueueSnackbar } from 'notistack';

// @project
import ItemNotFound from '@/components/ItemNotFound';
import RouterLink from '@/components/Link';
import Loader from '@/components/Loader';
import PageAnimateWrapper from '@/components/PageAnimateWrapper';

import { getBlog } from '@/sections/blog/api';
import BlogDetails from '@/sections/blog/blog-detail';
import BlogPreview from '@/sections/blog/BlogPreview';
import { handlerBreadcrumbs } from '@/states/breadcrumbs';
import { useRouter } from '@/utils/navigation';

// @assets
import { IconArrowLeft, IconEdit, IconEye } from '@tabler/icons-react';

/***************************  BLOGS - DETAIL  ***************************/

export default function BlogDetail() {
  const router = useRouter();
  const [blog, setBlog] = useState(null);
  const [isProcessing, setIsProcessing] = useState(true);
  const [preview, setPreview] = useState(false);

  const id = router.params.id;

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

    handlerBreadcrumbs(`/blog/detail/${id}`, [{ title: 'blog', url: '/blog' }, { title: 'detail' }]);
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
          <Typography variant="h6">Blog Post</Typography>
        </Stack>
        {blog && (
          <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
            <Button variant="outlined" color="secondary" startIcon={<IconEye size={16} />} onClick={() => setPreview(true)}>
              Preview
            </Button>
            <Button
              variant="contained"
              color="primary"
              startIcon={<IconEdit size={16} />}
              component={RouterLink}
              to={`/blog/edit/${blog.id}`}
            >
              Edit
            </Button>
          </Stack>
        )}
      </Stack>
      <PageAnimateWrapper>
        {blog ? (
          <>
            <BlogDetails {...{ blogData: blog }} />
            <BlogPreview {...{ blogData: blog, open: preview, handleClose: () => setPreview(false) }} />
          </>
        ) : (
          <ItemNotFound heading="Blog Not Found" caption="The blog you are looking for does not exist or may have been removed." />
        )}
      </PageAnimateWrapper>
    </Stack>
  );
}
