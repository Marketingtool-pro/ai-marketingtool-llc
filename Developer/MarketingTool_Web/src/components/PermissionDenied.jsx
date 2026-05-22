import PropTypes from 'prop-types';
// @mui
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import Typeset from '@/components/Typeset';
import DogJumpDoodle from '@/images/illustration/DogJumpDoodle';

/***************************  PERMISSION DENIED  ***************************/

export default function PermissionDenied({ heading = 'Permission Denied', caption = 'You do not have permission to access this page.' }) {
  return (
    <Container sx={{ textAlign: 'center', height: '100vh' }}>
      <Stack sx={{ alignItems: 'center', justifyContent: 'center', gap: 4, height: 1 }}>
        <Box sx={{ width: 350 }}>
          <DogJumpDoodle />
        </Box>
        <Typeset {...{ heading, caption, headingProps: { variant: 'h3' }, captionProps: { variant: 'body1' } }} />
      </Stack>
    </Container>
  );
}

PermissionDenied.propTypes = { heading: PropTypes.string, caption: PropTypes.string };
