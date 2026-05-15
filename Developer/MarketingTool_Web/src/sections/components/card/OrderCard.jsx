// @mui
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import { DRAWER_WIDTH } from '@/config';
import MainCard from '@/components/MainCard';

// @assets
import { IconArrowNarrowRight } from '@tabler/icons-react';

import avatar1 from '@/assets/images/users/avatar-1.png';
import avatar2 from '@/assets/images/users/avatar-2.png';
import avatar3 from '@/assets/images/users/avatar-3.png';
import avatar4 from '@/assets/images/users/avatar-4.png';
import avatar5 from '@/assets/images/users/avatar-5.png';

/***************************  ORDER CARD - DATA  ***************************/

const users = [{ avatar: avatar1 }, { avatar: avatar2 }, { avatar: avatar3 }, { avatar: avatar4 }, { avatar: avatar5 }];

/***************************  CARDS - ORDER CARD  ***************************/

export default function OrderCard() {
  return (
    <MainCard sx={{ p: 1.5, bgcolor: 'grey.50', boxShadow: 'none', maxWidth: `${DRAWER_WIDTH - 24}px` }}>
      <Stack sx={{ gap: 3 }}>
        <Stack direction="row" sx={{ justifyContent: 'space-between', alignItems: 'center' }}>
          <Stack sx={{ gap: 0.25 }}>
            <Typography variant="subtitle1">Orders</Typography>
            <Typography variant="caption">01 June to 01 July</Typography>
          </Stack>
          <IconButton variant="outlined" color="secondary" sx={{ bgcolor: 'background.default' }}>
            <IconArrowNarrowRight size={20} />
          </IconButton>
        </Stack>
        <AvatarGroup sx={{ justifyContent: 'flex-end' }}>
          {users.map((user, index) => (
            <Avatar key={index} src={user.avatar} />
          ))}
        </AvatarGroup>
      </Stack>
    </MainCard>
  );
}
