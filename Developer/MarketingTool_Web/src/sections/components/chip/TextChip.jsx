// @mui
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import MainCard from '@/components/MainCard';
import { ChipIconPosition } from '@/enum';

// @assets
import { IconArrowUp } from '@tabler/icons-react';

/***************************  CHIP - TEXT  ***************************/

export default function TextChip() {
  const position = ChipIconPosition.RIGHT;

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      <Grid size={12}>
        <Typography variant="subtitle1">Variant: `text`</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard>
          <Stack sx={{ gap: 2.5 }}>
            {['small', 'medium', 'large'].map((size, index) => {
              const commonProps = {
                label: 'Label',
                variant: 'text',
                size,
                icon: <IconArrowUp />
              };
              return (
                <Stack direction="row" key={index} sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip {...commonProps} color="primary" />
                  <Chip {...commonProps} color="secondary" />
                  <Chip {...commonProps} color="success" />
                  <Chip {...commonProps} color="error" />
                  <Chip {...commonProps} color="warning" />
                  <Chip {...commonProps} color="info" />
                </Stack>
              );
            })}
          </Stack>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard>
          <Stack sx={{ gap: 2.5 }}>
            {['small', 'medium', 'large'].map((size, index) => {
              const commonProps = {
                label: 'Label',
                variant: 'text',
                size,
                icon: <IconArrowUp />,
                position
              };
              return (
                <Stack direction="row" key={index} sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip {...commonProps} color="primary" />
                  <Chip {...commonProps} color="secondary" />
                  <Chip {...commonProps} color="success" />
                  <Chip {...commonProps} color="error" />
                  <Chip {...commonProps} color="warning" />
                  <Chip {...commonProps} color="info" />
                </Stack>
              );
            })}
          </Stack>
        </MainCard>
      </Grid>

      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard>
          <Stack sx={{ gap: 2.5 }}>
            {['small', 'medium', 'large'].map((size, index) => {
              const commonProps = {
                label: 'Label',
                variant: 'text',
                size,
                avatar: <IconArrowUp />
              };
              return (
                <Stack direction="row" key={index} sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip {...commonProps} color="primary" />
                  <Chip {...commonProps} color="secondary" />
                  <Chip {...commonProps} color="success" />
                  <Chip {...commonProps} color="error" />
                  <Chip {...commonProps} color="warning" />
                  <Chip {...commonProps} color="info" />
                </Stack>
              );
            })}
          </Stack>
        </MainCard>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard>
          <Stack sx={{ gap: 2.5 }}>
            {['small', 'medium', 'large'].map((size, index) => {
              const commonProps = {
                label: 'Label',
                variant: 'text',
                size,
                avatar: <IconArrowUp />,
                position
              };
              return (
                <Stack direction="row" key={index} sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip {...commonProps} color="primary" />
                  <Chip {...commonProps} color="secondary" />
                  <Chip {...commonProps} color="success" />
                  <Chip {...commonProps} color="error" />
                  <Chip {...commonProps} color="warning" />
                  <Chip {...commonProps} color="info" />
                </Stack>
              );
            })}
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
