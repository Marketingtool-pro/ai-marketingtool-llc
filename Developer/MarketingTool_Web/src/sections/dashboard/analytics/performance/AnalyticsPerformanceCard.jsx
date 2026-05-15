// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';

// @project
import PerformanceCard from '@/components/cards/PerformanceCard';
import { getRadiusStyles } from '@/utils/getRadiusStyles';

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
      [theme.breakpoints.only('xs')]: {
        '&:first-of-type': getRadiusStyles(radius, 'topLeft', 'topRight'),
        '&:last-of-type': getRadiusStyles(radius, 'bottomLeft', 'bottomRight')
      },
      [theme.breakpoints.between('sm', 'md')]: {
        '&:nth-of-type(1)': getRadiusStyles(radius, 'topLeft'),
        '&:nth-of-type(2)': getRadiusStyles(radius, 'topRight'),
        '&:nth-of-type(3)': getRadiusStyles(radius, 'bottomLeft', 'bottomRight')
      },
      [theme.breakpoints.up('md')]: {
        '&:first-of-type': getRadiusStyles(radius, 'topLeft', 'bottomLeft'),
        '&:last-of-type': getRadiusStyles(radius, 'topRight', 'bottomRight')
      }
    }
  };
}

/***************************   CARDS - DATA  ***************************/

const performanceAnalytics = [
  {
    title: 'Monthly Spend',
    value: '$0',
    compare: 'Budget: $0',
    targetProgress: { target: 0, achieved: 0, goal: 1 }
  },
  {
    title: 'Cost / Conversion',
    value: '$0.00',
    compare: 'Target: $0.00',
    targetProgress: { target: 0, achieved: 0, goal: 1 }
  },
  {
    title: 'Revenue',
    value: '$0',
    compare: 'Target: $0',
    targetProgress: { target: 0, achieved: 0, goal: 1 }
  }
];

/***************************   PERFORMANCE - CARDS  ***************************/

export default function AnalyticsPerformanceCard({ data }) {
  const theme = useTheme();
  const cardCommonProps = { border: 'none', borderRadius: 0, boxShadow: 'none' };
  const items = data || performanceAnalytics;

  return (
    <Grid container sx={{ borderRadius: 4, boxShadow: theme.vars.customShadows.section, ...applyBorderWithRadius(16, theme) }}>
      {items.map((item, index) => (
        <Grid key={index} size={{ xs: 12, sm: index === items.length - 1 ? 12 : 6, md: 4 }}>
          <PerformanceCard {...{ ...item, cardProps: { sx: cardCommonProps } }} />
        </Grid>
      ))}
    </Grid>
  );
}
