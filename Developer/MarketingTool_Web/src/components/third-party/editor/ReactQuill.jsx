import PropTypes from 'prop-types';
import { lazy } from 'react';

// @mui
import FormHelperText from '@mui/material/FormHelperText';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @project
import { ThemeFonts } from '@/config';

// @third-party
import { useController } from 'react-hook-form';
import 'react-quill-new/dist/quill.snow.css';

const ReactQuillEditor = lazy(() => import('react-quill-new'));

/***************************  EDITOR - REACT QUILL   ***************************/

export default function ReactQuill({ control, name = 'content', placeholder = 'Write something...', contentMinHeight = 150, rules }) {
  const defaultRules = {
    required: 'Content is required',
    validate: {
      trim: (value) => {
        const trimmed = value.replace(/<p><br><\/p>/g, '').trim();
        return trimmed.length > 0 || 'Content cannot be empty or contain only spaces';
      }
    }
  };

  const {
    field: { onChange, value },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules: rules ?? defaultRules
  });

  return (
    <Stack sx={{ gap: 0.5 }}>
      <Box
        sx={(theme) => ({
          '& .quill': {
            fontFamily: ThemeFonts.FONT_SORA,
            coloe: 'text.secondary',
            '& .ql-toolbar.ql-snow + .ql-container.ql-snow': { borderTop: 1, borderTopColor: error ? 'error.main' : 'divider' },
            '& .ql-toolbar': {
              border: 0,
              p: 0,
              '& .ql-formats': {
                borderRadius: 2,
                p: 0.5,
                bgcolor: 'grey.100',
                mr: 0.25,
                mb: 0.25,
                '& .ql-picker': {
                  height: 36,
                  '& .ql-picker-label': {
                    p: 0.75,
                    borderRadius: 2,
                    border: 0,
                    color: theme.vars.palette.text.secondary,
                    '& svg': { right: 0, left: 'unset' },
                    '&.ql-active, &:hover, &:focus': {
                      bgcolor: 'grey.300',
                      color: theme.vars.palette.text.primary,
                      '& svg > path, & svg > line, & svg > rect, & svg > circle, & svg > polygon': {
                        color: theme.vars.palette.text.primary,
                        stroke: theme.vars.palette.text.primary
                      }
                    }
                  }
                },
                '& button': {
                  width: 36,
                  height: 36,
                  mr: 0.25,
                  p: 1.25,
                  borderRadius: 2,
                  '&.ql-active, &:hover, &:focus': {
                    stroke: theme.vars.palette.text.primary,
                    '& svg > path, & svg > line': { stroke: theme.vars.palette.text.primary },
                    bgcolor: 'grey.300'
                  }
                }
              },
              '& .ql-picker-options': {
                backgroundColor: 'background.paper',
                borderColor: `${theme.vars.palette.divider} !important`,
                borderRadius: 2,
                boxShadow: theme.vars.customShadows.tooltip,
                color: 'text.primary',
                '& .ql-picker-item:hover': { color: theme.vars.palette.primary.main }
              }
            },
            '& .ql-container': {
              mt: 1.5,
              borderRadius: 2,
              '&.ql-snow': { borderColor: error ? 'error.main' : 'divider' },
              '& .ql-editor': {
                fontFamily: ThemeFonts.FONT_SORA,
                minHeight: contentMinHeight,
                textAlign: 'left',
                // placeholder styles
                '&.ql-blank::before': {
                  color: 'text.secondary',
                  opacity: 0.5,
                  fontStyle: 'unset',
                  ...theme.typography.body2,
                  left: 16,
                  right: 'unset'
                }
              }
            }
          }
        })}
      >
        <ReactQuillEditor {...{ placeholder, value, onChange }} />
      </Box>
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </Stack>
  );
}

ReactQuill.propTypes = {
  control: PropTypes.object,
  name: PropTypes.object,
  placeholder: PropTypes.string,
  contentMinHeight: PropTypes.number,
  rules: PropTypes.any
};
