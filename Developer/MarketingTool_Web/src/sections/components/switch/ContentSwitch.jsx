// @mui
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Switch from '@mui/material/Switch';
import Typography from '@mui/material/Typography';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  CONTENT - SWITCH  ***************************/

export default function ContentSwitch() {
  return (
    <PresentationCard title="Content">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap', ml: 1.25 }}>
        <FormGroup sx={{ gap: 2 }}>
          <FormControlLabel
            control={<Switch size="small" />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            control={<Switch size="small" defaultChecked />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            disabled
            control={<Switch size="small" />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2">Title will goes here</Typography>
                <Typography variant="caption" color="inherit">
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
        </FormGroup>
        <FormGroup sx={{ gap: 2 }}>
          <FormControlLabel
            control={<Switch />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            control={<Switch defaultChecked />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            disabled
            control={<Switch />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2">Title will goes here</Typography>
                <Typography variant="caption" color="inherit">
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
        </FormGroup>
        <FormGroup sx={{ gap: 2 }}>
          <FormControlLabel
            control={<Switch size="large" />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            control={<Switch size="large" defaultChecked />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            disabled
            control={<Switch size="large" />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="subtitle2">Title will goes here</Typography>
                <Typography variant="caption" color="inherit">
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
        </FormGroup>
      </Stack>
    </PresentationCard>
  );
}
