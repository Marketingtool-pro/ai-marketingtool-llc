import { useState, useEffect } from 'react';

// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tab from '@mui/material/Tab';
import Tabs from '@mui/material/Tabs';
import Box from '@mui/material/Box';

// @project
import AddLanguageModal from '@/sections/setting/internationalization/AddLanguageModal';
import ImportLanguage from '@/sections/setting/internationalization/ImportLanguage';
import ExportLanguage from '@/sections/setting/internationalization/ExportLanguage';
import { AuthenticationSetting, GeneralSetting, InternationalizationSetting, PricingSetting, ProfileSetting } from '@/sections/setting';
import { handlerBreadcrumbs } from '@/states/breadcrumbs';
import { handlerActiveItem, useGetMenuMaster } from '@/states/menu';
import { useRouter, usePathname } from '@/utils/navigation';

// @assets
import { IconDownload, IconPlus, IconUpload } from '@tabler/icons-react';

/***************************  SETTING  ***************************/

export default function Setting() {
  const router = useRouter();
  const pathname = usePathname();
  const { menuMaster } = useGetMenuMaster();

  const [open, setOpen] = useState(false);
  const [exoprtOpen, setExprtOpen] = useState(false);
  const [importopen, setImportOpen] = useState(false);

  const currentTab = router.params.tab || 'profile';

  const handleChange = (_event, newValue) => {
    if (newValue !== currentTab) {
      router.replace(`/setting/${newValue}`);
    }
  };

  useEffect(() => {
    if (menuMaster.openedItem !== 'setting') {
      handlerActiveItem('setting');
    }

    handlerBreadcrumbs(`/setting/${currentTab}`, [{ title: 'setting' }, { title: currentTab }]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, currentTab]);

  return (
    <Stack sx={{ gap: { xs: 3, md: 4 } }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} sx={{ gap: 3, justifyContent: 'space-between' }}>
        <Tabs variant="scrollable" scrollButtons="auto" value={currentTab} onChange={handleChange} aria-label="setting tabs">
          <Tab label="Profile" value="profile" />
          <Tab label="General" value="general" />
          <Tab label="Pricing" value="pricing" />
          <Tab label="Internationalization" value="internationalization" />
          <Tab label="Authentication" value="authentication" />
        </Tabs>
        {currentTab === 'internationalization' && (
          <Stack
            direction="row"
            sx={{ width: { xs: 1, sm: 'unset' }, gap: 1.5, alignItems: 'center', justifyContent: { xs: 'center', sm: 'flex-end' } }}
          >
            <Button variant="outlined" color="secondary" onClick={() => setExprtOpen(true)} startIcon={<IconDownload size={16} />}>
              Export
            </Button>
            <ExportLanguage open={exoprtOpen} onClose={() => setExprtOpen(false)} />
            <Button variant="outlined" color="secondary" onClick={() => setImportOpen(true)} startIcon={<IconUpload size={16} />}>
              Import
            </Button>
            <ImportLanguage open={importopen} onClose={() => setImportOpen(false)} />
            <IconButton onClick={() => setOpen(true)} variant="contained" color="primary">
              <IconPlus size={16} />
            </IconButton>
            <AddLanguageModal open={open} onClose={() => setOpen(false)} />
          </Stack>
        )}
      </Stack>

      <Box>
        {currentTab === 'profile' && <ProfileSetting />}
        {currentTab === 'general' && <GeneralSetting />}
        {currentTab === 'pricing' && <PricingSetting />}
        {currentTab === 'internationalization' && <InternationalizationSetting />}
        {currentTab === 'authentication' && <AuthenticationSetting />}
      </Box>
    </Stack>
  );
}
