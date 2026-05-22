// @mui
import InputLabel from '@mui/material/InputLabel';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import PresentationCard from '@/components/cards/PresentationCard';
import UrlField from '@/components/Url';

/***************************  INPUT - COPY LINK  ***************************/

export default function CopyLinkInput() {
  return (
    <PresentationCard title="Link Input">
      <Stack sx={{ gap: 2.5 }}>
        <Box>
          <InputLabel>WWW</InputLabel>
          <UrlField helpText="Website url" fullWidth />
        </Box>
        <Box>
          <InputLabel>Filled</InputLabel>
          <UrlField helpText="Website url" fullWidth defaultValue="www.saasable.com" />
        </Box>
        <Box>
          <InputLabel>Disabled</InputLabel>
          <UrlField helpText="Website url" fullWidth isDisabled />
        </Box>
      </Stack>
    </PresentationCard>
  );
}
