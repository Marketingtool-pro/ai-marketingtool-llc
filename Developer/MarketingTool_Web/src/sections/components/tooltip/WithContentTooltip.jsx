// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconHelp, IconUser } from '@tabler/icons-react';

/***************************  WITH CONTENT - TOOLTIP  ***************************/

export default function WithContentTooltip() {
  const contentTooltip = (
    <Stack direction="row" sx={{ gap: 0.75, p: 0.25 }}>
      <Box>
        <IconHelp size={16} />
      </Box>
      <Stack sx={{ gap: 0.5 }}>
        <Typography variant="caption1">Your hint text will placed here</Typography>
        <Typography variant="caption" sx={{ opacity: 0.7 }}>
          John Doe - Senior Developer at TechCorp. Passionate about AI & Web Development.
        </Typography>
      </Stack>
    </Stack>
  );

  return (
    <PresentationCard title="With Content">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip title={contentTooltip} placement="top">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Top
            </Button>
          </Tooltip>
          <Tooltip title={contentTooltip} arrow placement="top">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Top Arrow
            </Button>
          </Tooltip>
          <Tooltip title={contentTooltip} arrow placement="top-start">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Top Start
            </Button>
          </Tooltip>
          <Tooltip title={contentTooltip} arrow placement="top-end">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Top End
            </Button>
          </Tooltip>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip title={contentTooltip}>
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Bottom
            </Button>
          </Tooltip>
          <Tooltip title={contentTooltip} arrow>
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Bottom Arrow
            </Button>
          </Tooltip>
          <Tooltip title={contentTooltip} arrow placement="bottom-start">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Bottom Start
            </Button>
          </Tooltip>
          <Tooltip title={contentTooltip} arrow placement="bottom-end">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Bottom End
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
