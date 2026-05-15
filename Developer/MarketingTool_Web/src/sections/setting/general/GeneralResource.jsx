// @mui
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import ListItem from '@mui/material/ListItem';
import List from '@mui/material/List';

// @project
import SettingCard from '@/components/cards/SettingCard';

// @assets
import { IconChevronRight, IconClock, IconHelp, IconKeyboard, IconStatusChange, IconShieldCheck, IconMap, IconFileText, IconCookie, IconLock } from '@tabler/icons-react';

const resourceData = [
  { id: 1, icon: <IconStatusChange />, title: 'Release Notes', buttonLabel: 'View', buttonType: 'button', external: 'https://marketingtool.pro/release-notes/' },
  { id: 2, icon: <IconHelp />, title: 'Help Center', buttonLabel: 'Get Help', buttonType: 'button', external: 'https://marketingtool.pro/help/' },
  { id: 3, icon: <IconMap />, title: 'Roadmap', buttonType: 'icon', external: 'https://marketingtool.pro/roadmap/' },
  { id: 4, icon: <IconShieldCheck />, title: 'Trust & Verification', buttonType: 'icon', external: 'https://marketingtool.pro/trust-verification/' },
  { id: 5, icon: <IconLock />, title: 'Privacy Policy', buttonType: 'icon', external: 'https://marketingtool.pro/privacy-policy/' },
  { id: 6, icon: <IconFileText />, title: 'Terms & Conditions', buttonType: 'icon', external: 'https://marketingtool.pro/terms-policy/' },
  { id: 7, icon: <IconCookie />, title: 'Cookie Policy', buttonType: 'icon', external: 'https://marketingtool.pro/cookie-policy/' },
];

/***************************  GENERAL - RESOURCE  ***************************/

export default function GeneralResource() {
  const listStyle = { p: { xs: 2, sm: 3 }, flexWrap: 'wrap', gap: 1 };

  return (
    <SettingCard title="Resource" caption="Access essential resources and information.">
      <List disablePadding>
        {resourceData.map((item) => (
          <ListItem key={item.id} sx={listStyle} divider>
            <Stack direction="row" sx={{ justifyContent: 'space-between', width: 1, alignItems: 'center' }}>
              <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center' }}>
                {item.icon}
                <Typography variant="body1">{item.title}</Typography>
              </Stack>
              {item.buttonType === 'button' ? (
                <Button
                  variant="outlined"
                  size="small"
                  color="secondary"
                  onClick={() => window.open(item.external, '_blank')}
                >
                  {item.buttonLabel}
                </Button>
              ) : (
                <IconButton
                  size="small"
                  color="secondary"
                  aria-label="open"
                  onClick={() => window.open(item.external, '_blank')}
                >
                  <IconChevronRight size={16} />
                </IconButton>
              )}
            </Stack>
          </ListItem>
        ))}
      </List>
    </SettingCard>
  );
}
