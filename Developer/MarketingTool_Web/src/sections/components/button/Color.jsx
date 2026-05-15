// @mui
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

// @project
import PresentationCard from '@/components/cards/PresentationCard';

/***************************  BUTTON - COLOR  ***************************/

export default function Color() {
  return (
    <PresentationCard title="Color">
      <Stack sx={{ gap: 2.5 }}>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button>Default / Primary</Button>
          <Button color="secondary">Secondary</Button>
          <Button color="success">Success</Button>
          <Button color="error">Error</Button>
          <Button color="warning">Warning</Button>
          <Button color="info">Info</Button>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="contained">Default / Primary</Button>
          <Button variant="contained" color="secondary">
            Secondary
          </Button>
          <Button variant="contained" color="success">
            Success
          </Button>
          <Button variant="contained" color="error">
            Error
          </Button>
          <Button variant="contained" color="warning">
            Warning
          </Button>
          <Button variant="contained" color="info">
            Info
          </Button>
        </Stack>
        <Stack direction="row" sx={{ gap: 1.5, alignItems: 'center', flexWrap: 'wrap' }}>
          <Button variant="outlined">Default / Primary</Button>
          <Button variant="outlined" color="secondary">
            Secondary
          </Button>
          <Button variant="outlined" color="success">
            Success
          </Button>
          <Button variant="outlined" color="error">
            Error
          </Button>
          <Button variant="outlined" color="warning">
            Warning
          </Button>
          <Button variant="outlined" color="info">
            Info
          </Button>
        </Stack>
      </Stack>
    </PresentationCard>
  );
}
