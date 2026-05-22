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
      [theme.breakpoints.down('xs')]: {
        '&:nth-of-type(1)': getRadiusStyles(radius, 'topLeft'),
        '&:nth-of-type(2)': getRadiusStyles(radius, 'topRight'),
        '&:nth-of-type(3)': getRadiusStyles(radius, 'bottomLeft'),
        '&:nth-of-type(4)': getRadiusStyles(radius, 'bottomRight')
      },
      [theme.breakpoints.up('sm')]: {
        '&:first-of-type': getRadiusStyles(radius, 'topLeft', 'bottomLeft'),
        '&:last-of-type': getRadiusStyles(radius, 'topRight', 'bottomRight')
      }
    }
  };
}

/***************************   OVERVIEW CARD -DATA  ***************************/

const overviewBlog = [
  {
    title: 'Users',
    value: '304k',
    compare: 'Compare to last week',
    chip: {
      label: '24.5%',
      avatar: <IconArrowUp />
    }
  },
  {
    title: 'New Users',
    value: '12k',
    compare: 'Compare to last week',
    chip: {
      label: '2.4%',
      color: 'error',
      avatar: <IconArrowDown />
    }
  },
  {
    title: 'Avg. Engagement Time',
    value: '1m 27s',
    compare: 'Compare to last week',
    chip: {
      label: '20.5%',
      avatar: <IconArrowUp />
    }
  }
];

/***************************   OVERVIEW - CARDS  ***************************/

export default function BlogOverviewCard() {
  const theme = useTheme();

  return (
    <Grid container sx={{ borderRadius: 4, boxShadow: theme.vars.customShadows.section, ...applyBorderWithRadius(16, theme) }}>
      {overviewBlog.map((item, index) => (
        <Grid key={index} size={{ xs: 12, sm: 4 }}>
          <OverviewCard {...{ ...item, cardProps: { sx: { border: 'none', borderRadius: 0, boxShadow: 'none' } } }} />
        </Grid>
      ))}
    </Grid>
  );
}
