// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconHelp, IconUser } from '@tabler/icons-react';

/***************************  ICON - TOOLTIP  ***************************/

export default function IconTooltip() {
  const basicTooltip = (
    <Stack direction="row" sx={{ alignItems: 'center', gap: 0.5 }}>
      <IconHelp size={16} /> Your hint text will placed here <IconHelp size={16} />
    </Stack>
  );

  return (
    <PresentationCard title="Icon">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip title={basicTooltip} placement="top">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Top
            </Button>
          </Tooltip>
          <Tooltip title={basicTooltip} arrow placement="top">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Top Arrow
            </Button>
          </Tooltip>
          <Tooltip title={basicTooltip} arrow placement="top-start">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Top Start
            </Button>
          </Tooltip>
          <Tooltip title={basicTooltip} arrow placement="top-end">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Top End
            </Button>
          </Tooltip>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Tooltip title={basicTooltip}>
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Bottom
            </Button>
          </Tooltip>
          <Tooltip title={basicTooltip} arrow>
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Bottom Arrow
            </Button>
          </Tooltip>
          <Tooltip title={basicTooltip} arrow placement="bottom-start">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Bottom Start
            </Button>
          </Tooltip>
          <Tooltip title={basicTooltip} arrow placement="bottom-end">
            <Button variant="outlined" startIcon={<IconUser size={16} />}>
              Bottom End
            </Button>
          </Tooltip>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
