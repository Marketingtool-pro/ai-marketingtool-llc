// @mui
import { useTheme } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

// @assets
import { IconUser } from '@tabler/icons-react';

/***************************  BASIC - TOOLTIP  ***************************/

export default function BasicTooltip() {
  const theme = useTheme();

  return (
    <PresentationCard title="Basic">
      <Tooltip
        title="Your hint text will placed here"
        placement={theme.direction === 'rtl' ? 'left' : 'right'}
        open
        slotProps={{ popper: { sx: { zIndex: 1 } } }}
      >
        <IconButton variant="outlined" aria-label="user">
          <IconUser size={16} />
        </IconButton>
      </Tooltip>
    </PresentationCard>
  );
}
