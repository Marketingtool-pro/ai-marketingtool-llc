import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';

// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import Loader from '@/components/Loader';
import { AccountList, AccountUpsert } from '@/sections/account';
import { useGetAccountFilter, useGetAccounts } from '@/sections/account/api';

// @assets
import { IconPlus } from '@tabler/icons-react';

/***************************  ACCOUNT  ***************************/

export default function Account() {
  const swrKey = useLoaderData();

  const { accountsLoading } = useGetAccounts(swrKey);
  const { accountFilterLoading } = useGetAccountFilter();

  const [open, setOpen] = useState(false);

  return (
    <Stack sx={{ gap: { xs: 2, sm: 3 } }}>
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap: 2, flexWrap: 'wrap' }}>
        <Typography variant="h6">Account</Typography>
        <Button variant="contained" startIcon={<IconPlus size={16} />} onClick={() => setOpen(true)}>
          Add New
        </Button>
        <AccountUpsert {...{ open, onClose: () => setOpen(false) }} />
      </Stack>
      {accountsLoading || accountFilterLoading ? <Loader /> : <AccountList />}
    </Stack>
  );
}
