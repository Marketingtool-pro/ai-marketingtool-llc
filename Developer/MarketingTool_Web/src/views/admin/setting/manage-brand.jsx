import { useEffect } from 'react';

// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import PageAnimateWrapper from '@/components/PageAnimateWrapper';
import {
  BrandColor,
  BrandCoverImage,
  BrandLogo,
  BrandSlogan,
  BrandShortDescription,
  BrandSocialLinks
} from '@/sections/setting/general/brand';
import { handlerBreadcrumbs } from '@/states/breadcrumbs';
import { useRouter } from '@/utils/navigation';

// @assets
import { IconArrowLeft } from '@tabler/icons-react';

/***************************  BRAND - MANAGE  ***************************/

export default function Brand() {
  const router = useRouter();

  const handleButtonClick = () => {
    router.back();
  };

  useEffect(() => {
    handlerBreadcrumbs(`/setting/general/brand`, [{ title: 'setting' }, { title: 'general', url: '/setting/general' }, { title: 'brand' }]);
  }, []);

  return (
    <Stack sx={{ gap: { xs: 3, md: 4 } }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
          <IconButton onClick={handleButtonClick} color="secondary" variant="outlined" aria-label="back">
            <IconArrowLeft />
          </IconButton>
          <Typography variant="h6">Brand</Typography>
        </Stack>
        <Button variant="contained">SAVE</Button>
      </Stack>
      <PageAnimateWrapper>
        <Stack sx={{ gap: { xs: 2, md: 3 } }}>
          <BrandLogo />
          <BrandColor />
          <BrandCoverImage />
          <BrandSlogan />
          <BrandShortDescription />
          <BrandSocialLinks />
        </Stack>
      </PageAnimateWrapper>
    </Stack>
  );
}
