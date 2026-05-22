// @mui
import { useTheme } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

// @project
import BehaviorCard from '@/components/cards/BehaviorCard';
import MainCard from '@/components/MainCard';
import { getRadiusStyles } from '@/utils/getRadiusStyles';

// @assets
import { IconArrowDown, IconArrowUpRight } from '@tabler/icons-react';

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

/***************************   BEHAVIOR CARD - DATA  ***************************/

const userBehaviorAnalytics = [
  {
    title: 'Active Campaigns',
    value: '0',
    compare: 'Connect ad accounts',
    chip: {
      label: '0%',
      icon: <IconArrowUpRight />
    }
  },
  {
    title: 'Avg. CTR',
    value: '0%',
    compare: 'Connect ad accounts',
    chip: {
      label: '0%',
      icon: <IconArrowUpRight />
    }
  },
  {
    title: 'Avg. CPC',
    value: '$0.00',
    compare: 'Connect ad accounts',
    chip: {
      label: '0%',
      icon: <IconArrowUpRight />
    }
  }
];

/***************************   USER BEHAVIOR - CARDS  ***************************/

export default function AnalyticsBehaviorCard({ data }) {
  const theme = useTheme();
  const cardCommonProps = { border: 'none', borderRadius: 0, boxShadow: 'none' };
  const items = data || userBehaviorAnalytics;

  return (
    <Grid container sx={{ borderRadius: 4, boxShadow: theme.vars.customShadows.section, ...applyBorderWithRadius(16, theme) }}>
      {items.map((item, index) => (
        <Grid key={index} size={{ xs: 6, md: 2.75 }}>
          <BehaviorCard {...{ ...item, cardProps: { sx: cardCommonProps } }} />
        </Grid>
      ))}
      <Grid size={{ xs: 6, md: 3.75 }}>
        <MainCard sx={{ ...cardCommonProps, height: 1, display: 'flex', alignItems: 'center', textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Connect your ad accounts to see campaign performance insights and optimization recommendations.
          </Typography>
        </MainCard>
      </Grid>
    </Grid>
  );
}
