import PropTypes from 'prop-types';
// @mui
import useMediaQuery from '@mui/material/useMediaQuery';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import HtmlRenderer from '@/components/HtmlRenderer';
import MainCard from '@/components/MainCard';
import Typeset from '@/components/Typeset';

/***************************  BLOGS - DETAIL  ***************************/

export default function BlogDetail({ blogData }) {
  const downMD = useMediaQuery((theme) => theme.breakpoints.down('md'));

  return (
    <MainCard sx={{ p: 0 }}>
      <Grid container>
        {/* ml put for grid manage because of divider */}
        <Grid size={{ xs: 12, md: 8 }} sx={{ ml: '-1px' }}>
          <Stack sx={{ gap: 3, p: { xs: 1.75, sm: 2.25, md: 3 } }}>
            <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Typeset
                headingProps={{ variant: 'h4' }}
                captionProps={{ variant: 'caption' }}
                heading="Blog Content"
                caption="View a blog details"
              />
              <Stack direction="row" sx={{ gap: 1 }}>
                {blogData.isDraft && <Chip label="Draft" color="info" size="small" />}
                <Chip
                  label={!blogData.isArchived ? 'Published' : 'Archived'}
                  color={!blogData.isArchived ? 'success' : 'error'}
                  size="small"
                />
              </Stack>
            </Stack>
            {blogData?.content ? <HtmlRenderer htmlString={blogData.content} /> : <Typography variant="body2">N/A</Typography>}
          </Stack>
        </Grid>
        <Divider {...(!downMD ? { orientation: 'vertical', flexItem: true } : { sx: { width: 1 } })} />
        <Grid size={{ xs: 12, md: 4 }}>
          <Stack sx={{ gap: 2.5, p: { xs: 1.75, sm: 2.25, md: 3 } }}>
            <Typography variant="subtitle1">Content</Typography>
            <Stack sx={{ gap: 2 }}>
              <Stack sx={{ gap: 1.25 }}>
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  Blog Title
                </Typography>
                <Typography variant="body2">{blogData?.title || 'N/A'}</Typography>
              </Stack>
              <Stack sx={{ gap: 1.25 }}>
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  Caption
                </Typography>
                <Typography variant="body2">{blogData?.caption || 'N/A'}</Typography>
              </Stack>
              <Stack sx={{ gap: 1.25 }}>
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  Tag
                </Typography>
                <Typography variant="body2">
                  {blogData?.tags?.length ? blogData?.tags?.map((item) => `#${item}`).join(', ') : 'N/A'}
                </Typography>
              </Stack>
              <Stack sx={{ gap: 1.25 }}>
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  Category
                </Typography>
                {blogData?.categories?.length ? (
                  <Stack direction="row" sx={{ gap: 0.5 }}>
                    {blogData.categories.map((item, index) => (
                      <Chip key={index} label={item} variant="outlined" size="small" />
                    ))}
                  </Stack>
                ) : (
                  <Typography variant="body2">N/A</Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
          <Divider />
          <Stack sx={{ gap: 2.5, p: { xs: 1.75, sm: 2.25, md: 3 } }}>
            <Typography variant="subtitle1">SEO</Typography>
            <Stack sx={{ gap: 2 }}>
              <Stack sx={{ gap: 1.25 }}>
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  Title
                </Typography>
                <Typography variant="body2">{blogData?.seo?.title || 'N/A'}</Typography>
              </Stack>
              <Stack sx={{ gap: 1.25 }}>
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  Slug
                </Typography>
                <Typography variant="body2">{blogData?.slug || 'N/A'}</Typography>
              </Stack>
              <Stack sx={{ gap: 1.25 }}>
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  Description
                </Typography>
                <Typography variant="body2">{blogData?.seo?.description || 'N/A'}</Typography>
              </Stack>
              <Stack sx={{ gap: 1.25 }}>
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  Cover Image
                </Typography>
                {blogData?.banner?.url ? (
                  <CardMedia src={blogData?.banner?.url} component="img" alt="blog detail image" sx={{ maxHeight: 200, borderRadius: 2 }} />
                ) : (
                  <Typography variant="body2">N/A</Typography>
                )}
              </Stack>
            </Stack>
          </Stack>
        </Grid>
      </Grid>
    </MainCard>
  );
}

BlogDetail.propTypes = { blogData: PropTypes.any };
