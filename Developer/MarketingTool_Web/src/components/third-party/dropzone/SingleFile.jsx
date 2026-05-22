import PropTypes from 'prop-types';
// @mui
import { styled } from '@mui/material/styles';
import FormHelperText from '@mui/material/FormHelperText';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { useDropzone } from 'react-dropzone';
import { useController } from 'react-hook-form';

// @project
import PlaceholderContent from './PlaceholderContent';
import RejectionFiles from './RejectionFiles';

// @assets
import {
  IconEdit,
  IconFile,
  IconFileTypeCss,
  IconFileTypeCsv,
  IconFileTypeDoc,
  IconFileTypeDocx,
  IconFileTypeHtml,
  IconFileTypeJs,
  IconFileTypeJsx,
  IconFileTypePdf,
  IconFileTypePhp,
  IconFileTypePpt,
  IconFileTypeRs,
  IconFileTypeSql,
  IconFileTypeTs,
  IconFileTypeTsx,
  IconFileTypeTxt,
  IconFileTypeVue,
  IconFileTypeXls,
  IconFileTypeXml,
  IconFileTypeZip,
  IconPhoto,
  IconVideo,
  IconX
} from '@tabler/icons-react';

// Video and image extensions
const videoExtensions = ['.mp4', '.mov', '.avi', '.mkv', '.webm'];
const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.bmp', '.svg', '.webp'];

const fileIcons = {
  '.css': IconFileTypeCss,
  '.csv': IconFileTypeCsv,
  '.doc': IconFileTypeDoc,
  '.docx': IconFileTypeDocx,
  '.html': IconFileTypeHtml,
  '.js': IconFileTypeJs,
  '.jsx': IconFileTypeJsx,
  '.pdf': IconFileTypePdf,
  '.php': IconFileTypePhp,
  '.ppt': IconFileTypePpt,
  '.rs': IconFileTypeRs,
  '.sql': IconFileTypeSql,
  '.ts': IconFileTypeTs,
  '.tsx': IconFileTypeTsx,
  '.txt': IconFileTypeTxt,
  '.vue': IconFileTypeVue,
  '.xls': IconFileTypeXls,
  '.xml': IconFileTypeXml,
  '.zip': IconFileTypeZip
};

// Add image formats
imageExtensions.forEach((ext) => {
  fileIcons[ext] = IconPhoto;
});

// Add video formats
videoExtensions.forEach((ext) => {
  fileIcons[ext] = IconVideo;
});

const DropzoneWrapper = styled('div')(({ theme }) => ({
  outline: 'none',
  overflow: 'hidden',
  position: 'relative',
  padding: theme.spacing(2),
  borderRadius: 8,
  transition: theme.transitions.create('padding'),
  background: theme.vars.palette.background.paper,
  border: `1px dashed ${theme.vars.palette.grey[300]}`
}));

function getFileExtension(file) {
  const name = typeof file === 'string' ? file : file.name;
  const match = name.match(/\.[^.]+$/);
  const ext = match ? match[0].toLowerCase() : null;
  return ext && ext in fileIcons ? ext : null;
}

/*************************** DROPZONE - SINGLE FILE ***************************/

export default function SingleFileUpload({ control, name, placeholder, accept, rules }) {
  const {
    field: { onChange, value },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules: rules ?? {
      required: 'File is required',
      validate: (file) => typeof file === 'object' || file instanceof File || 'Invalid file'
    }
  });

  const { getRootProps, getInputProps, isDragActive, isDragReject, fileRejections } = useDropzone({
    accept,
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length) onChange(acceptedFiles[0]);
    }
  });

  const extension = getFileExtension(value);
  const FileIcon = extension ? fileIcons[extension] : IconFile;

  const isObject = value && typeof value === 'object' && 'url' in value;

  const fileName = value instanceof File ? value.name : isObject ? value.name : '';
  const fileSize = value instanceof File ? (value.size / 1024).toFixed(1) + ' KB' : isObject ? (value.size / 1024).toFixed(1) + ' KB' : '';
  const imageUrl = value instanceof File ? URL.createObjectURL(value) : isObject ? value.url : '';

  return (
    <Box>
      <DropzoneWrapper
        {...getRootProps()}
        sx={{
          cursor: 'pointer',
          ...(isDragActive && { opacity: 0.72 }),
          ...((isDragReject || error) && { borderColor: 'error.main' })
        }}
      >
        <input {...getInputProps()} />
        {imageUrl ? (
          <Box sx={{ position: 'relative' }}>
            <Stack sx={{ width: 1, alignItems: 'center', textAlign: 'center', gap: 0.5 }}>
              <FileIcon size={64} stroke={1} />
              <Box sx={{ typography: 'body2', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: 1 }}>
                {fileName}
              </Box>
              <Box sx={{ typography: 'caption', color: 'text.secondary' }}>{fileSize}</Box>
            </Stack>

            <Stack direction="row" sx={{ gap: 1, alignItems: 'center', position: 'absolute', top: 0, right: 0 }}>
              <IconButton variant="contained" color="primary" size="small">
                <IconEdit size={20} />
              </IconButton>
              <IconButton
                variant="contained"
                color="error"
                size="small"
                onClick={(event) => {
                  event.stopPropagation(); // Prevent parent click event from firing
                  onChange({ name: '', size: 0, url: '' });
                }}
              >
                <IconX size={20} />
              </IconButton>
            </Stack>
          </Box>
        ) : (
          <PlaceholderContent {...placeholder} />
        )}
      </DropzoneWrapper>

      {fileRejections.length > 0 && <RejectionFiles fileRejections={fileRejections} />}
      {error && <FormHelperText error>{error.message}</FormHelperText>}
    </Box>
  );
}

SingleFileUpload.propTypes = {
  control: PropTypes.any,
  name: PropTypes.any,
  placeholder: PropTypes.any,
  accept: PropTypes.any,
  rules: PropTypes.any
};
