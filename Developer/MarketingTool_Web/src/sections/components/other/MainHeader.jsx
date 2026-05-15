// @mui
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import Stack from '@mui/material/Stack';

// @project
import Breadcrumbs from '@/components/Breadcrumbs';
import PresentationCard from '@/components/cards/PresentationCard';
import Profile from '@/components/Profile';
import { AvatarSize } from '@/enum';

// @assets
import { IconBell, IconCommand, IconSearch } from '@tabler/icons-react';
import avatar1 from '@/assets/images/users/avatar-1.png';

// @types

/***************************  PROFILE - DATA  ***************************/

const profileData = {
  avatar: { src: avatar1, size: AvatarSize.XS },
  title: 'Erika Collins',
  caption: 'Admin'
};

/***************************  OTHER - MAIN HEADER  ***************************/

export default function MainHeader() {
  const theme = useTheme();

  return (
    <PresentationCard title="Main Header">
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Breadcrumbs />
        <Stack direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
          <OutlinedInput
            placeholder="Search here"
            startAdornment={
              <InputAdornment position="start">
                <IconSearch />
              </InputAdornment>
            }
            endAdornment={
              <InputAdornment position="end">
                <IconCommand color={theme.vars.palette.grey[700]} />
              </InputAdornment>
            }
            aria-describedby="Search"
            slotProps={{ input: { 'aria-label': 'search' } }}
          />
          <IconButton variant="outlined" color="secondary" size="small">
            <IconBell size={16} />
          </IconButton>
          <Profile {...profileData} />
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
