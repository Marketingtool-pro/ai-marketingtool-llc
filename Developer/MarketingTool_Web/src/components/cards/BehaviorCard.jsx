import PropTypes from 'prop-types';
import Chip from '@mui/material/Chip';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import MainCard from '@/components/MainCard';

/***************************   CARD - BEHAVIOR   ***************************/

export default function BehaviorCard({ title, value, chip, compare, cardProps }) {
  const chipDefaultProps = { color: 'success', variant: 'text', size: 'small' };

  return (
    <MainCard {...cardProps}>
      <Stack sx={{ gap: 2.5 }}>
        <Typography variant="subtitle1">{title}</Typography>
        <Stack sx={{ gap: 0.5 }}>
          <Typography variant="h4">{value}</Typography>
          <Stack direction="row" sx={{ gap: 0.6, alignItems: 'center' }}>
            <Chip {...{ ...chipDefaultProps, ...chip }} />
            <Typography variant="caption" color="grey.700">
              {compare}
            </Typography>
          </Stack>
        </Stack>
      </Stack>
    </MainCard>
  );
}

BehaviorCard.propTypes = {
  title: PropTypes.string,
  value: PropTypes.string,
  chip: PropTypes.any,
  compare: PropTypes.string,
  cardProps: PropTypes.any
};
