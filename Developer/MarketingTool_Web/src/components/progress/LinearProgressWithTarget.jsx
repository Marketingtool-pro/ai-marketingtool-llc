import PropTypes from 'prop-types';
// @mui
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import LinearProgress from '@mui/material/LinearProgress';
import Stack from '@mui/material/Stack';

// @types

/***************************  LINEAR PROGRESS - WITH TARGET  ***************************/

export default function LinearProgressWithTarget({ target, achieved, goal }) {
  const theme = useTheme();

  // Calculate the percentage
  const percentTarget = target <= 0 ? 0 : target >= goal ? 100 : (target / goal) * 100;
  const percentAchieved = achieved <= 0 ? 0 : achieved >= goal ? 100 : (achieved / goal) * 100;
  const isTargetAchieved = percentAchieved >= percentTarget;

  return (
    <Stack sx={{ position: 'relative', justifyContent: 'center', height: 24 }}>
      <LinearProgress
        value={percentAchieved}
        sx={{
          height: 14,
          borderRadius: 1,
          '& .MuiLinearProgress-bar': {
            borderRadius: 1,
            bgcolor: isTargetAchieved ? 'success.main' : 'error.main',
            ...theme.applyStyles('dark', { bgcolor: isTargetAchieved ? 'success.light' : 'error.light' })
          }
        }}
        aria-label="linear progress with target"
      />

      {/* Target identifier */}
      <Divider
        orientation="vertical"
        flexItem
        sx={{ position: 'absolute', left: `${percentTarget}%`, top: 0, height: 1, borderColor: 'text.secondary', borderRadius: 1 }}
      />
    </Stack>
  );
}

LinearProgressWithTarget.propTypes = { target: PropTypes.any, achieved: PropTypes.any, goal: PropTypes.any };
