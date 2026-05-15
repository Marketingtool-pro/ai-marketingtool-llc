// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import { Translate } from '@/sections/setting/internationalization/translate';
import { useRouter } from '@/utils/navigation';

// @assets
import { IconArrowLeft } from '@tabler/icons-react';
import { handlerBreadcrumbs } from '@/states/breadcrumbs';
import { useEffect } from 'react';

/***************************  I18N - TRANSLATE  ***************************/

export default function TranslateI18N() {
  const router = useRouter();
  const language = router.params.language;

  const handleButtonClick = () => {
    router.back();
  };

  useEffect(() => {
    if (!language) return;

    handlerBreadcrumbs(`/setting/internationalization/translate/${language}`, [
      { title: 'setting' },
      { title: 'internationalization', url: '/setting/internationalization' },
      { title: 'brand' }
    ]);
  }, [language]);

  return (
    <Stack sx={{ gap: { xs: 3, md: 4 } }}>
      <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
          <IconButton onClick={handleButtonClick} color="secondary" variant="outlined">
            <IconArrowLeft />
          </IconButton>
          <Typography variant="h6" sx={{ textTransform: 'capitalize' }}>
            {language}
          </Typography>
        </Stack>
        <Stack direction={'row'} sx={{ gap: 1.5, alignItems: 'center' }}>
          <Button variant="contained" sx={{ borderColor: 'text.Divider' }}>
            Save
          </Button>
        </Stack>
      </Stack>

      <Translate language={language} />
    </Stack>
  );
}
