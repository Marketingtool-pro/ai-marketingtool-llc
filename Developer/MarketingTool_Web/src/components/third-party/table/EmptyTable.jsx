import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @images
import { UnboxingDoodle } from '@/images/illustration';

/***************************  REACT TABLE - EMPTY  ***************************/

export default function EmptyTable({ msg }) {
  return (
    <Stack sx={{ alignItems: 'center', justifyContent: 'center', height: 150 }}>
      <UnboxingDoodle />
      <Typography color="text.secondary">{msg}</Typography>
    </Stack>
  );
}

EmptyTable.propTypes = { msg: PropTypes.string };
