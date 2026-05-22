// @mui
import Checkbox from '@mui/material/Checkbox';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormGroup from '@mui/material/FormGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  CHECKBOX - CONTENT  ***************************/

export default function Content() {
  return (
    <PresentationCard title="Content">
      <Stack direction="row" sx={{ alignItems: 'flex-start', gap: 2.5, flexWrap: { xs: 'wrap', sm: 'nowrap' } }}>
        <FormGroup sx={{ gap: 2.5 }}>
          <FormControlLabel
            control={<Checkbox size="small" sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            control={<Checkbox size="small" defaultChecked sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            control={<Checkbox size="small" indeterminate sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
        </FormGroup>
        <FormGroup sx={{ gap: 2.5 }}>
          <FormControlLabel
            control={<Checkbox sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            control={<Checkbox defaultChecked sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            control={<Checkbox indeterminate sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
        </FormGroup>
        <FormGroup sx={{ gap: 2.5 }}>
          <FormControlLabel
            control={<Checkbox size="large" sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            control={<Checkbox size="large" defaultChecked sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            control={<Checkbox size="large" indeterminate sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" sx={{ color: 'text.secondary' }}>
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
        </FormGroup>
        <FormGroup sx={{ gap: 2.5 }}>
          <FormControlLabel
            disabled
            control={<Checkbox sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" color="inherit">
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            disabled
            control={<Checkbox defaultChecked sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
                <Typography variant="caption" color="inherit">
                  Choose the content you want to view.
                </Typography>
              </Stack>
            }
            sx={{ alignItems: 'flex-start' }}
          />
          <FormControlLabel
            disabled
            control={<Checkbox indeterminate sx={{ mt: -1 }} />}
            label={
              <Stack sx={{ gap: 0.5 }}>
                <Typography variant="caption1">Title will goes here</Typography>
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
