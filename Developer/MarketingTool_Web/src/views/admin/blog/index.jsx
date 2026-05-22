// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import RouterLink from '@/components/Link';
import PageAnimateWrapper from '@/components/PageAnimateWrapper';
import { BlogList, BlogOverviewCard } from '@/sections/blog';

// @assets
import { IconPlus } from '@tabler/icons-react';

/***************************  BLOGS  ***************************/

export default function Blogs() {
  return (
    <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6">Blogs</Typography>
        <Button variant="contained" startIcon={<IconPlus size={16} />} component={RouterLink} to="/blog/create">
          Add New
        </Button>
      </Stack>
      <PageAnimateWrapper>
        <Stack sx={{ gap: { xs: 2, md: 3 } }}>
          <BlogOverviewCard />
          <BlogList />
        </Stack>
      </PageAnimateWrapper>
    </Stack>
  );
}
