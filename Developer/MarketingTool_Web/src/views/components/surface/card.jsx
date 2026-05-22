// @mui
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import ProgressCard from '@/components/cards/ProgressCard';
import VideoCard from '@/components/cards/VideoCard';
import MainCard from '@/components/MainCard';
import LinearProgressWithTarget from '@/components/progress/LinearProgressWithTarget';
import { AnalyticsCards, OrderCard, TopReferrers, UpgradePlan } from '@/sections/components/card';

// @types

// @assets
import posterImg from '@/assets/images/cards/poster.png';
import videoSrc from '@/assets/videos/test.mp4';

const targetProgressData = [
  { target: 70, achieved: 85, goal: 100 },
  { target: 120, achieved: 150, goal: 200 },
  { target: 75, achieved: 60, goal: 100 }
];

const videoData = {
  caption: 'Showcase and manage your video content with a sleek and responsive video card.',
  poster: posterImg,
  videoSrc: videoSrc
};

/***************************  COMPOENT - CARD  ***************************/

export default function Card() {
  return (
    <ComponentsWrapper title="Card">
      <Grid container spacing={3}>
        {/* card 1 */}
        <Grid size={12}>
          <AnalyticsCards />
        </Grid>
        {/* card 2 */}
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <TopReferrers />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <Stack sx={{ gap: 3 }}>
            <MainCard>
              <ProgressCard title="Sales" value="34,789" progress={{ value: 20.5 }} />
            </MainCard>
            <MainCard>
              <Stack sx={{ gap: 3, maxWidth: 120 }}>
                {targetProgressData.map((data, index) => (
                  <LinearProgressWithTarget key={index} {...data} />
                ))}
              </Stack>
            </MainCard>
          </Stack>
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <VideoCard {...videoData} />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <Stack direction={{ md: 'row', lg: 'column' }} sx={{ gap: 3, alignItems: 'flex-start' }}>
            <UpgradePlan />
            <OrderCard />
          </Stack>
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
