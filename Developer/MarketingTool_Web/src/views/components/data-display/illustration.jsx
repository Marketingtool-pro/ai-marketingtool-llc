// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import MainCard from '@/components/MainCard';

// @assets
import {
  BalletDoodle,
  CoffeeDoddle,
  DancingDoodle,
  DogJumpDoodle,
  DoogieDoodle,
  DumpingDoodle,
  FloatDoodle,
  GroovyDoodle,
  GroovySittingDoodle,
  IceCreamDoodle,
  LayingDoodle,
  LovingDoodle,
  MeditatingDoodle,
  MessyDoodle,
  MoshingDoodle,
  PettingDoodle,
  PlantDoodle,
  ReadingDoodle,
  ReadingSideDoodle,
  RollerSkatingDoodle,
  RollingDoodle,
  RunningDoodle,
  SelfieDoodle,
  SitReadingDoodle,
  SittingDoodle,
  SleekDoodle,
  SprintingDoodle,
  StrollingDoodle,
  SwingingDoodle,
  UnboxingDoodle,
  ZombieingDoodle
} from '@/images/illustration';

const illustarations = [
  { id: 'ballet-doodle', component: <BalletDoodle /> },
  { id: 'coffee-doodle', component: <CoffeeDoddle /> },
  { id: 'dancing-doodle', component: <DancingDoodle /> },
  { id: 'dog-jump-doodle', component: <DogJumpDoodle /> },
  { id: 'doogie-doodle', component: <DoogieDoodle /> },
  { id: 'dumping-doodle', component: <DumpingDoodle /> },
  { id: 'float-doodle', component: <FloatDoodle /> },
  { id: 'groovy-doodle', component: <GroovyDoodle /> },
  { id: 'groovy-sitting-doodle', component: <GroovySittingDoodle /> },
  { id: 'ice-cream-doodle', component: <IceCreamDoodle /> },
  { id: 'laying-doodle', component: <LayingDoodle /> },
  { id: 'loving-doodle', component: <LovingDoodle /> },
  { id: 'meditating-doodle', component: <MeditatingDoodle /> },
  { id: 'messy-doodle', component: <MessyDoodle /> },
  { id: 'moshing-doodle', component: <MoshingDoodle /> },
  { id: 'petting-doodle', component: <PettingDoodle /> },
  { id: 'plant-doodle', component: <PlantDoodle /> },
  { id: 'reading-doodle', component: <ReadingDoodle /> },
  { id: 'reading-side-doodle', component: <ReadingSideDoodle /> },
  { id: 'roller-skating-doodle', component: <RollerSkatingDoodle /> },
  { id: 'rolling-doodle', component: <RollingDoodle /> },
  { id: 'running-doodle', component: <RunningDoodle /> },
  { id: 'selfie-doodle', component: <SelfieDoodle /> },
  { id: 'sit-reading-doodle', component: <SitReadingDoodle /> },
  { id: 'sitting-doodle', component: <SittingDoodle /> },
  { id: 'sleek-doodle', component: <SleekDoodle /> },
  { id: 'sprinting-doodle', component: <SprintingDoodle /> },
  { id: 'strolling-doodle', component: <StrollingDoodle /> },
  { id: 'swinging-doodle', component: <SwingingDoodle /> },
  { id: 'unboxing-doodle', component: <UnboxingDoodle /> },
  { id: 'zombieing-doodle', component: <ZombieingDoodle /> }
];

/***************************  DATA DISPLAY - ILLUSTRATION  ***************************/

export default function DataDisplayIllustaration() {
  return (
    <ComponentsWrapper title="Illustration">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        {illustarations.map((user, index) => (
          <Grid key={index} size={{ xs: 12, sm: 6, md: 3 }}>
            <MainCard sx={{ p: 1.25 }}>{user.component}</MainCard>
          </Grid>
        ))}
      </Grid>
    </ComponentsWrapper>
  );
}
