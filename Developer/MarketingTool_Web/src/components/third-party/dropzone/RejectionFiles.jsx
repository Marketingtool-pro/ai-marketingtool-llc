import PropTypes from 'prop-types';
// @mui
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

// @project
import { withAlpha } from '@/utils/colorUtils';

// @utils
import getDropzoneData from '@/utils/getDropzoneData';

/*************************** DROPZONE - REJECTION FILES ***************************/

export default function RejectionFiles({ fileRejections }) {
  return (
    <Paper
      variant="outlined"
      sx={{ py: 1, px: 2, mt: 3, borderColor: 'error.light', bgcolor: (theme) => withAlpha(theme.vars.palette.error.main, 0.08) }}
    >
      {fileRejections.map(({ file, errors }) => {
        const { path, size } = getDropzoneData(file);

        return (
          <Box key={path} sx={{ my: 1 }}>
            <Typography variant="subtitle2" noWrap>
              {path} - {size ? size : ''}
            </Typography>

            {errors.map((error) => (
              <Box key={error.code} component="li" sx={{ typography: 'caption' }}>
                {error.message}
              </Box>
            ))}
          </Box>
        );
      })}
    </Paper>
  );
}

RejectionFiles.propTypes = { fileRejections: PropTypes.array };
