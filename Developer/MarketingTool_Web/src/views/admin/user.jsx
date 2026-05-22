import { useState } from 'react';

// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import { UserList, UserUpsert } from '@/sections/user';

// @assets
import { IconPlus } from '@tabler/icons-react';

/***************************  USER  ***************************/

export default function User() {
  const [open, setOpen] = useState(false);

  return (
    <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6">User</Typography>
        <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={() => setOpen(true)}>
          Add New
        </Button>
        <UserUpsert {...{ open, onClose: () => setOpen(false) }} />
      </Stack>
      <UserList />
    </Stack>
  );
}
