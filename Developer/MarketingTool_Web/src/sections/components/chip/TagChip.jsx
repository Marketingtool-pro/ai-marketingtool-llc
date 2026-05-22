// @mui
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import MainCard from '@/components/MainCard';
import { ChipIconPosition } from '@/enum';

/***************************  CHIP - TAG  ***************************/

export default function TagChip() {
  const position = ChipIconPosition.RIGHT;

  return (
    <Grid container spacing={{ xs: 2, sm: 3 }}>
      <Grid size={12}>
        <Typography variant="subtitle1">Variant: `tag`</Typography>
      </Grid>
      <Grid size={{ xs: 12, md: 6 }}>
        <MainCard>
          <Stack sx={{ gap: 2.5 }}>
            {['small', 'medium', 'large'].map((size, index) => {
              const commonProps = {
                label: 'Label',
                variant: 'tag',
                size,
                clickable: true
              };
              return (
                <Stack direction="row" key={index} sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip {...commonProps} color="default" />
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
                variant: 'tag',
                size,
                clickable: true,
                onDelete: () => {}
              };
              return (
                <Stack direction="row" key={index} sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip {...commonProps} color="default" />
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
      <Grid size={12}>
        <MainCard>
          <Stack sx={{ gap: 2.5 }}>
            {['small', 'medium', 'large'].map((size, index) => {
              const commonProps = {
                variant: 'tag',
                size,
                clickable: true,
                avatar: <Avatar>2</Avatar>,
                position
              };
              return (
                <Stack direction="row" key={index} sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
                  <Chip {...commonProps} label="Default" color="default" />
                  <Chip {...commonProps} label="Primary" color="primary" />
                  <Chip {...commonProps} label="Secondary" color="secondary" />
                  <Chip {...commonProps} label="Success" color="success" />
                  <Chip {...commonProps} label="Error" color="error" />
                  <Chip {...commonProps} label="Warning" color="warning" />
                  <Chip {...commonProps} label="Info" color="info" />
                </Stack>
              );
            })}
          </Stack>
        </MainCard>
      </Grid>
    </Grid>
  );
}
