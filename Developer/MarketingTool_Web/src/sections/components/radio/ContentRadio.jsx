// @mui
import FormControlLabel from '@mui/material/FormControlLabel';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  CONTENT - RADIO  ***************************/

export default function ContenttRadio() {
  return (
    <PresentationCard title="Content">
      <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
        <RadioGroup aria-labelledby="radio-group-content-small" defaultValue={1} name="radio-group-content-small" sx={{ gap: 2.5 }}>
          <FormControlLabel
            control={<Radio value={0} size="small" sx={{ mt: -0.5 }} />}
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
            control={<Radio value={1} size="small" sx={{ mt: -0.5 }} />}
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
        </RadioGroup>
        <RadioGroup aria-labelledby="radio-group-content-default" defaultValue={1} name="radio-group-content-default" sx={{ gap: 2.5 }}>
          <FormControlLabel
            control={<Radio value={0} sx={{ mt: -0.5 }} />}
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
            control={<Radio value={1} sx={{ mt: -0.5 }} />}
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
        </RadioGroup>
        <RadioGroup aria-labelledby="radio-group-content-large" defaultValue={1} name="radio-group-content-large" sx={{ gap: 2.5 }}>
          <FormControlLabel
            control={<Radio size="large" value={0} sx={{ mt: -0.5 }} />}
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
            control={<Radio size="large" value={1} sx={{ mt: -0.5 }} />}
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
        </RadioGroup>
        <RadioGroup aria-labelledby="radio-group-content-disabled" defaultValue={1} name="radio-group-content-disabled" sx={{ gap: 2.5 }}>
          <FormControlLabel
            disabled
            control={<Radio value={0} sx={{ mt: -0.5 }} />}
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
            control={<Radio value={1} sx={{ mt: -0.5 }} />}
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
        </RadioGroup>
      </Stack>
    </PresentationCard>
  );
}
