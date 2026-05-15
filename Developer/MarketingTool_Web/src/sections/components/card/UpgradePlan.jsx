// @mui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import { DRAWER_WIDTH } from '@/config';
import MainCard from '@/components/MainCard';
import { AvatarSize } from '@/enum';

// @assets
import { IconBolt } from '@tabler/icons-react';

/***************************  UPGRADE CARD - DATA  ***************************/

const data = {
  title: 'Upgrade your plan',
  description: 'Unlock premium features and enhance your experience. Choose a plan that fits your needs.',
  icon: <IconBolt size={16} />
};

/***************************  CARD - UPGRADE PLAN  ***************************/

export default function UpgradePlan() {
  const theme = useTheme();

  return (
    <MainCard sx={{ p: 1.5, bgcolor: 'grey.50', boxShadow: 'none', maxWidth: `${DRAWER_WIDTH - 24}px` }}>
      <Stack sx={{ gap: 3 }}>
        <Avatar
          variant="rounded"
          size={AvatarSize.XS}
          sx={(theme) => ({
            bgcolor: 'grey.300',
            ...theme.applyStyles('dark', {
              bgcolor: 'grey.300'
            })
          })}
        >
          <IconBolt color={theme.vars.palette.text.primary} />
        </Avatar>
        <Stack sx={{ gap: 1, alignItems: 'flex-start', textWrap: 'wrap' }}>
          <Typography variant="subtitle1">{data.title}</Typography>
          <Typography variant="caption" color="text.secondary">
            {data.description}
          </Typography>
          <Button startIcon={data.icon} variant="contained" sx={{ mt: 0.5 }}>
            Upgrade Now
          </Button>
        </Stack>
      </Stack>
    </MainCard>
  );
}
