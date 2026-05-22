// @mui
import Grid from '@mui/material/Grid';

// @project
import ComponentsWrapper from '@/components/ComponentsWrapper';
import LazySection from '@/components/LazySection';

/***************************  DATA DISPLAY - CHIP  ***************************/

export default function DataDisplayChip() {
  return (
    <ComponentsWrapper title="Chip">
      <Grid container spacing={{ xs: 2, sm: 3 }}>
        <Grid size={12}>
          <LazySection
            sections={{ importFunc: () => import('@/sections/components/chip').then((module) => ({ default: module.LightChip })) }}
            offset="200px"
          />
        </Grid>
        <Grid size={12}>
          <LazySection
            sections={{ importFunc: () => import('@/sections/components/chip').then((module) => ({ default: module.TextChip })) }}
            offset="200px"
          />
        </Grid>
        <Grid size={12}>
          <LazySection
            sections={{ importFunc: () => import('@/sections/components/chip').then((module) => ({ default: module.OutlinedChip })) }}
            offset="200px"
          />
        </Grid>
        <Grid size={12}>
          <LazySection
            sections={{ importFunc: () => import('@/sections/components/chip').then((module) => ({ default: module.FilledChip })) }}
            offset="200px"
          />
        </Grid>
        <Grid size={12}>
          <LazySection
            sections={{ importFunc: () => import('@/sections/components/chip').then((module) => ({ default: module.TagChip })) }}
            offset="200px"
          />
        </Grid>
      </Grid>
    </ComponentsWrapper>
  );
}
