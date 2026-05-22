import PropTypes from 'prop-types';

// @mui
import AppBar from '@mui/material/AppBar';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import Dialog from '@mui/material/Dialog';
import Grid from '@mui/material/Grid';
import IconButton from '@mui/material/IconButton';
import Slide from '@mui/material/Slide';
import Stack from '@mui/material/Stack';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

// @project
import HtmlRenderer from '@/components/HtmlRenderer';
import MainCard from '@/components/MainCard';

// @assets
import { IconLibraryPhoto, IconX } from '@tabler/icons-react';

/***************************  DIALOG - ANIMATION  ***************************/

function Transition({ ref, ...props }) {
  return <Slide direction="up" ref={ref} {...props} />;
}

/***************************  BLOG - PREVIEW  ***************************/

export default function BlogPreview({ blogData, open, handleClose }) {
  const { title, caption, banner, content, tags, categories } = blogData;

  return (
    <Dialog
      fullScreen
      open={open}
      onClose={handleClose}
      slots={{ transition: Transition }}
      slotProps={{ paper: { sx: { width: 1 } }, container: { sx: { width: 1 } } }}
    >
      <AppBar
        elevation={0}
        sx={{ position: 'relative', bgcolor: 'grey.50', color: 'text.primary', borderBottom: '1px solid', borderColor: 'divider' }}
      >
        <Toolbar>
          <Typography sx={{ flex: 1 }} variant="h6">
            Blog Preview
          </Typography>
          <IconButton color="secondary" size="small" onClick={handleClose} aria-label="close">
            <IconX />
          </IconButton>
        </Toolbar>
      </AppBar>
      <Container sx={{ py: { xs: 2, sm: 3, md: 4, lg: 7 } }}>
        <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
          <Stack sx={{ gap: 1.25 }}>
            <Typography variant="h2">{title || 'Your blog title goes here'}</Typography>
            <Typography variant="h6" color="secondary">
              {caption || 'Your blog caption goes here'}
            </Typography>
          </Stack>
          <MainCard sx={{ p: 0, border: 'none', bgcolor: 'grey.50', color: 'grey.300', height: { xs: 320, sm: 360, md: 420 } }}>
            {banner?.url ? (
              <CardMedia component="img" src={banner.url} sx={{ height: 1 }} />
            ) : (
              <Stack sx={{ height: 1, justifyContent: 'center', alignItems: 'center', gap: 2 }}>
                <IconLibraryPhoto size={180} />
                <Typography variant="h4" sx={{ color: 'grey.500' }}>
                  A relevant image, pattern, or gradient that complements your blog theme.
                </Typography>
              </Stack>
            )}
          </MainCard>
          <Grid container spacing={{ xs: 2, sm: 4, md: 10 }}>
            <Grid size={{ xs: 12, sm: 8 }}>
              {content ? (
                <HtmlRenderer htmlString={content} />
              ) : (
                <Typography variant="body2" sx={{ color: 'grey.700' }}>
                  Provide details, insights, or arguments about the first key point
                </Typography>
              )}
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <MainCard>
                <Stack sx={{ gap: 2.5 }}>
                  <Typography variant="subtitle1">Content</Typography>
                  <Stack sx={{ gap: 1.25 }}>
                    <Typography variant="body2" sx={{ color: 'grey.700' }}>
                      Tags
                    </Typography>
                    {tags && tags.length > 0 ? (
                      <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center', flexWrap: 'wrap' }}>
                        {tags.map((tag, index) => (
                          <Typography key={index} variant="body2">
                            #{tag}
                          </Typography>
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2">No tags available</Typography>
                    )}
                  </Stack>
                  <Stack sx={{ gap: 1.25 }}>
                    <Typography variant="body2" sx={{ color: 'grey.700' }}>
                      Category
                    </Typography>
                    {categories && categories.length > 0 ? (
                      <Stack direction="row" sx={{ gap: 0.75, alignItems: 'center', flexWrap: 'wrap' }}>
                        {categories.map((item, index) => (
                          <Chip key={index} label={item} variant="outlined" size="small" />
                        ))}
                      </Stack>
                    ) : (
                      <Typography variant="body2">No categories available</Typography>
                    )}
                  </Stack>
                </Stack>
              </MainCard>
            </Grid>
          </Grid>
        </Stack>
      </Container>
    </Dialog>
  );
}

Transition.propTypes = { ref: PropTypes.any, props: PropTypes.any };

BlogPreview.propTypes = { blogData: PropTypes.any, open: PropTypes.bool, handleClose: PropTypes.func };
