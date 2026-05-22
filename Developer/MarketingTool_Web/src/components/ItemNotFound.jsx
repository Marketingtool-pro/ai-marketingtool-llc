import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import Typeset from '@/components/Typeset';
import ReadingSideDoodle from '@/images/illustration/ReadingSideDoodle';

/***************************  ITEM NOT FOUND  ***************************/

export default function ItemNotFound({ heading = 'Item Note Found', caption }) {
  return (
    <Stack sx={{ alignItems: 'center', textAlign: 'center' }}>
      <Box sx={{ height: 170, width: 230, m: 'auto' }}>
        <ReadingSideDoodle />
      </Box>
      <Typeset {...{ heading, caption }} />
    </Stack>
  );
}

ItemNotFound.propTypes = { heading: PropTypes.string, caption: PropTypes.string };
