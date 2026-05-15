// @mui
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import { AvatarSize } from '@/enum';

/***************************  AVATAR - TEXT  ***************************/

export default function TextAvatar() {
  return (
    <PresentationCard title="Text">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar size={AvatarSize.BADGE}>01</Avatar>
          <Avatar size={AvatarSize.XXS}>HV</Avatar>
          <Avatar size={AvatarSize.XS}>RN</Avatar>
          <Avatar size={AvatarSize.SM}>BD</Avatar>
          <Avatar size={AvatarSize.MD}>TS</Avatar>
          <Avatar size={AvatarSize.LG}>DM</Avatar>
          <Avatar size={AvatarSize.XL}>AG</Avatar>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.BADGE}>01</Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.XXS}>HV</Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.XS}>RN</Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.SM}>BD</Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.MD}>TS</Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.LG}>DM</Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.XL}>AG</Avatar>
          </Badge>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
