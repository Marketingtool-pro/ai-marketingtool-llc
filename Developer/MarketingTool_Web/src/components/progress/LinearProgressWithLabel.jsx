import PropTypes from 'prop-types';
// @mui
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import { LinearProgressPlacement, LinearProgressType } from '@/enum';

export { LinearProgressPlacement, LinearProgressType };

// Define a mapping of placement values to StackProps
const stackPropsMap = {
  [LinearProgressPlacement.TOPRIGHT]: { direction: 'column-reverse', alignItems: 'flex-end' },
  [LinearProgressPlacement.BOTTOMRIGHT]: { direction: 'column', alignItems: 'flex-end' },
  [LinearProgressPlacement.TOPLEFT]: { direction: 'column-reverse', alignItems: 'flex-start' },
  [LinearProgressPlacement.BOTTOMLEFT]: { direction: 'column', alignItems: 'flex-start' },
  [LinearProgressPlacement.TOP]: { direction: 'column-reverse', alignItems: 'center' },
  [LinearProgressPlacement.BOTTOM]: { direction: 'column', alignItems: 'center' },
  [LinearProgressPlacement.LEFT]: { direction: 'row-reverse', alignItems: 'center' },
  [LinearProgressPlacement.RIGHT]: { direction: 'row', alignItems: 'center' } // Default case also covers RIGHT placement
};

/***************************  LINEAR PROGRESS - WITH LABEL  ***************************/

export default function LinearProgressWithLabel({ placement = LinearProgressPlacement.RIGHT, value, ...props }) {
  // Retrieve the StackProps based on the placement or use the default placement if not found
  const stackProps = stackPropsMap[placement] || stackPropsMap[LinearProgressPlacement.RIGHT];

  return (
    <Stack {...stackProps} sx={{ gap: 1, ...stackProps.sx }}>
      <Box sx={{ width: 1, minWidth: 120 }}>
        <LinearProgress value={value} {...props} />
      </Box>
      <Typography variant="body2">{`${Math.round(value)}%`}</Typography>
    </Stack>
  );
}

LinearProgressWithLabel.propTypes = {
  placement: PropTypes.any,
  LinearProgressPlacement: PropTypes.any,
  RIGHT: PropTypes.any,
  value: PropTypes.any,
  props: PropTypes.any
};
