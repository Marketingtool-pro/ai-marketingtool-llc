import PropTypes from 'prop-types';

// @mui
import { useTheme } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

// @project
import { AvatarSize } from '@/enum';

// @assets
import { IconUpload } from '@tabler/icons-react';

/*************************** UPLOAD - PLACEHOLDER ***************************/

export default function PlaceholderContent({ label, caption }) {
  const theme = useTheme();

  return (
    <Stack sx={{ textAlign: 'center', gap: 2, justifyContent: 'center', alignItems: 'center' }}>
      <Avatar
        sx={(theme) => ({
          bgcolor: 'primary.lighter',
          ...theme.applyStyles('dark', {
            bgcolor: 'primary.lighter'
          })
        })}
        size={AvatarSize.XS}
        variant="rounded"
      >
        <IconUpload color={theme.vars.palette.primary.darker} />
      </Avatar>
      <Stack sx={{ gap: 0.75 }}>
        <Typography component="div" variant="body2" sx={{ color: 'text.secondary' }}>
          {label || (
            <>
              <Typography variant="subtitle2" component="span" sx={{ color: 'primary.main' }}>
                Click to upload &nbsp;
              </Typography>
              or drag and drop&nbsp;
            </>
          )}
        </Typography>

        <Typography component="div" variant="caption" sx={{ color: 'grey.700' }}>
          {caption || 'SVG, PNG, JPG or GIF (max. 800x400 px)'}
        </Typography>
      </Stack>
    </Stack>
  );
}

PlaceholderContent.propTypes = {
  label: PropTypes.oneOfType([PropTypes.node, PropTypes.string]),
  caption: PropTypes.oneOfType([PropTypes.node, PropTypes.string])
};
