import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';

// @project
import DebouncedInput from '@/components/third-party/table/DebouncedInput';

/***************************  TABLE - TOOLBAR  ***************************/

export default function Toolbar({ onGlobalSearch }) {
  const gap = 0.75;

  return (
    <Stack
      direction={{ xs: 'column', sm: 'row' }}
      sx={{
        alignItems: { xs: 'start', sm: 'center' },
        justifyContent: 'space-between',
        gap: { xs: 1, sm: 2 },
        px: { xs: 1.25, sm: 2.5 },
        py: 0.5,
        width: 1
      }}
    >
      <Stack direction="row" sx={{ alignItems: 'center', justifyContent: 'space-between', gap, minWidth: { xs: 1, sm: 'fit-content' } }}>
        <Stack direction="row" sx={{ alignItems: 'center', gap }}>
          <DebouncedInput placeholder="Search here" value="" onValueChange={(data) => onGlobalSearch(data)} borderless />
        </Stack>
      </Stack>
    </Stack>
  );
}

Toolbar.propTypes = { onGlobalSearch: PropTypes.any };
