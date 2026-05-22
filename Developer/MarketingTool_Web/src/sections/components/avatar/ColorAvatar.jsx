// @mui
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  AVATAR - COLOR  ***************************/

export default function ColorAvatar() {
  return (
    <PresentationCard title="Color">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <Avatar color="default" />
        <Avatar />
        <Avatar color="secondary" />
        <Avatar color="success" />
        <Avatar color="error" />
        <Avatar color="warning" />
        <Avatar color="info" />
      </Stack>
    </PresentationCard>
  );
}
