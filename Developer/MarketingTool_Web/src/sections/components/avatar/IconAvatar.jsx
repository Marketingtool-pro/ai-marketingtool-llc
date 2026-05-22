// @mui
import Avatar from '@mui/material/Avatar';
import Badge from '@mui/material/Badge';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import { AvatarSize } from '@/enum';

// @assets
import { IconArrowUp, IconDisabled, IconEye, IconNotification, IconUsers } from '@tabler/icons-react';

/***************************  AVATAR - ICON  ***************************/

export default function IconAvatar() {
  return (
    <PresentationCard title="Icon">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Avatar size={AvatarSize.BADGE}>
            <IconArrowUp />
          </Avatar>
          <Avatar size={AvatarSize.XXS}>
            <IconDisabled />
          </Avatar>
          <Avatar size={AvatarSize.XS}>
            <IconEye />
          </Avatar>
          <Avatar size={AvatarSize.SM}>
            <IconNotification />
          </Avatar>
          <Avatar size={AvatarSize.MD}>
            <IconEye stroke={1.15} />
          </Avatar>
          <Avatar size={AvatarSize.LG}>
            <IconUsers stroke={1.15} />
          </Avatar>
          <Avatar size={AvatarSize.XL}>
            <IconNotification stroke={1} />
          </Avatar>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.BADGE}>
              <IconArrowUp />
            </Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.XXS}>
              <IconDisabled />
            </Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.XS}>
              <IconEye />
            </Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.SM}>
              <IconNotification />
            </Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.MD}>
              <IconEye stroke={1.15} />
            </Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.LG}>
              <IconUsers stroke={1.15} />
            </Avatar>
          </Badge>
          <Badge overlap="circular" variant="dot" color="success" anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}>
            <Avatar size={AvatarSize.XL}>
              <IconNotification stroke={1} />
            </Avatar>
          </Badge>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
