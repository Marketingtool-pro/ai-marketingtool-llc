import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

// @project
import OverviewCard from '@/components/cards/OverviewCard';
import { getRadiusStyles } from '@/utils/getRadiusStyles';

// @assets
import { IconArrowDown, IconArrowUp } from '@tabler/icons-react';

/***************************  CARDS - BORDER WITH RADIUS  ***************************/

export function applyBorderWithRadius(radius, theme) {
  return {
    overflow: 'hidden',
    '--Grid-borderWidth': '1px',
    borderTop: 'var(--Grid-borderWidth) solid',
    borderLeft: 'var(--Grid-borderWidth) solid',
    borderColor: 'divider',
    '& > div': {
      overflow: 'hidden',
      borderRight: 'var(--Grid-borderWidth) solid',
      borderBottom: 'var(--Grid-borderWidth) solid',
      borderColor: 'divider',
      [theme.breakpoints.down('md')]: {
        '&:nth-of-type(1)': getRadiusStyles(radius, 'topLeft'),
        '&:nth-of-type(2)': getRadiusStyles(radius, 'topRight'),
        '&:nth-of-type(3)': getRadiusStyles(radius, 'bottomLeft'),
        '&:nth-of-type(4)': getRadiusStyles(radius, 'bottomRight')
      },
      [theme.breakpoints.up('md')]: {
        '&:first-of-type': getRadiusStyles(radius, 'topLeft', 'bottomLeft'),
        '&:last-of-type': getRadiusStyles(radius, 'topRight', 'bottomRight')
      }
    }
  };
}

/***************************   OVERVIEW CARD -DATA  ***************************/

const overviewAnalytics = [
  {
    title: 'Total Spend',
    value: '$0',
    compare: 'Connect ad accounts to see data',
    chip: {
      label: '0%',
      avatar: <IconArrowUp />
    }
  },
  {
    title: 'Revenue',
    value: '$0',
    compare: 'Connect ad accounts to see data',
    chip: {
      label: '0%',
      avatar: <IconArrowUp />
    }
  },
  {
    title: 'ROAS',
    value: '0.0x',
    compare: 'Connect ad accounts to see data',
    chip: {
      label: '0%',
      avatar: <IconArrowUp />
    }
  },
  {
    title: 'Conversions',
    value: '0',
    compare: 'Connect ad accounts to see data',
    chip: {
      label: '0%',
      avatar: <IconArrowUp />
    }
  }
];

/***************************   OVERVIEW - CARDS  ***************************/

export default function AnalyticsOverviewCard({ data }) {
  const theme = useTheme();
  const items = data || overviewAnalytics;

  return (
    <Grid container sx={{ borderRadius: 4, boxShadow: theme.vars.customShadows.section, ...applyBorderWithRadius(16, theme) }}>
      {items.map((item, index) => (
        <Grid key={index} size={{ xs: 6, sm: 6, md: 3 }}>
          <OverviewCard {...{ ...item, cardProps: { sx: { border: 'none', borderRadius: 0, boxShadow: 'none' } } }} />
        </Grid>
      ))}
    </Grid>
  );
}

AnalyticsOverviewCard.propTypes = { data: PropTypes.array };
