import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

// @mui
import { useTheme } from '@mui/material/styles';
import CardMedia from '@mui/material/CardMedia';
import FormHelperText from '@mui/material/FormHelperText';
import SpeedDial from '@mui/material/SpeedDial';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';

// @third-party
import { useDropzone } from 'react-dropzone';
import { useController } from 'react-hook-form';

// @project
import { withAlpha } from '@/utils/colorUtils';

// @assets
import { IconArrowBackUp, IconCamera, IconCameraUp, IconTrash } from '@tabler/icons-react';

const circleRadius = 40; // Circle radius
const buttonSize = 24; // Fixed button size
const gap = 4; // Fixed gap between buttons
const circumference = 2 * Math.PI * circleRadius;

const initialActions = [{ name: 'Delete', icon: <IconTrash size={16} /> }];

const discardAction = { name: 'Discard', icon: <IconArrowBackUp size={16} /> };

/*************************** DROPZONE - AVATAR UPLOAD ***************************/

export default function AvatarUpload({ control, name = 'avatar', showDiscardAction, initialAvatar }) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const [actions, setActions] = useState(initialActions);

  const shadow = `0px 3px 5px -1px ${withAlpha(theme.vars.palette.text.primary, 0.2)},0px 6px 10px 0px ${withAlpha(theme.vars.palette.text.primary, 0.14)},0px 1px 18px 0px ${withAlpha(theme.vars.palette.text.primary, 0.12)}`;

  const {
    field: { onChange, value },
    fieldState: { error }
  } = useController({
    name,
    control,
    rules: {
      required: 'Avatar is required',
      validate: (file) => {
        if (typeof file === 'string') return true;
        if (file && typeof file === 'object' && file instanceof File && file.type.startsWith('image/')) return true;
        return 'Invalid file';
      }
    }
  });

  useEffect(() => {
    setActions(showDiscardAction ? [...initialActions, discardAction] : initialActions);
  }, [showDiscardAction]);

  const totalButtons = actions.length;
  const totalSpace = buttonSize * totalButtons + gap * (totalButtons - 1);

  // **Refining Angle Calculation for Exact Button Arrangement**
  const angleStep = totalSpace > circumference ? -(2 * Math.PI) / totalButtons : (-(buttonSize + gap) / circumference) * (2 * Math.PI);

  const calculateButtonPosition = (index) => {
    const startAngle = (4.045 * Math.PI) / 2; // Right-bottom starting position
    const angle = startAngle + index * angleStep; // **Anticlockwise movement**
    const x = circleRadius + circleRadius * Math.cos(angle) - buttonSize / 2;
    const y = circleRadius + circleRadius * Math.sin(angle) - buttonSize / 2;
    return { x, y };
  };

  const commonFabStyle = { width: buttonSize, height: buttonSize, minHeight: buttonSize };

  const { getRootProps, getInputProps, isDragActive, fileRejections } = useDropzone({
    accept: { 'image/*': [] },
    multiple: false,
    onDrop: (acceptedFiles) => {
      if (acceptedFiles.length) onChange(acceptedFiles[0]);
    }
  });

  return (
    <Stack>
      <Box
        sx={{
          position: 'relative',
          width: 80,
          height: 80,
          borderRadius: '50%',
          bgcolor: 'primary.lighter',
          ...(isDragActive && { opacity: 0.72 })
        }}
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        {value ? (
          <Box sx={{ position: 'relative', width: 1, height: 1, overflow: 'visible' }}>
            <CardMedia
              component="img"
              src={typeof value === 'string' ? value : URL.createObjectURL(value)}
              sx={{ width: 1, height: 1, bgcolor: 'background.paper', borderRadius: '50%' }}
              onLoad={() => {
                URL.revokeObjectURL(value);
              }}
            />

            <SpeedDial
              ariaLabel="avatar actions"
              icon={<IconCamera size={14} />}
              direction="up"
              open={open}
              onClick={(e) => {
                e.stopPropagation();
                setOpen((prev) => !prev);
              }}
              FabProps={{
                color: 'secondary',
                sx: { ...commonFabStyle, boxShadow: shadow, '&:active': { boxShadow: shadow } }
              }}
              sx={{ position: 'absolute', bottom: 0, right: 0, width: 1, height: 1, alignItems: 'flex-end' }}
            >
              {actions.map((action, index) => {
                const { x, y } = calculateButtonPosition(index);

                const handlerMap = {
                  Delete: () => onChange(null),
                  Discard: () => onChange(initialAvatar || null)
                };

                return (
                  <SpeedDialAction
                    key={action.name}
                    icon={action.icon}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlerMap[action.name]?.(); // safely call based on action name
                    }}
                    sx={{
                      ...commonFabStyle,
                      pb: 0,
                      '&.MuiSpeedDialAction-fab': { m: 0, boxShadow: shadow, '&:active': { boxShadow: shadow } },
                      // Custom positioning for each action button
                      position: 'absolute',
                      left: x,
                      top: y
                    }}
                  />
                );
              })}
            </SpeedDial>
          </Box>
        ) : (
          <Stack sx={{ width: 1, height: 1, alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
            <IconCameraUp size={40} stroke={1.5} color={theme.vars.palette.primary.main} />
          </Stack>
        )}
      </Box>
      {fileRejections.length > 0 ? (
        fileRejections[0].errors.map((error, index) => (
          <FormHelperText error key={index}>
            {error.message}
          </FormHelperText>
        ))
      ) : error ? (
        <FormHelperText error>{error.message}</FormHelperText>
      ) : null}
    </Stack>
  );
}

AvatarUpload.propTypes = {
  control: PropTypes.object,
  name: PropTypes.object,
  as: PropTypes.any,
  Path: PropTypes.any,
  TFieldValues: PropTypes.any,
  showDiscardAction: PropTypes.bool,
  initialAvatar: PropTypes.oneOfType([PropTypes.string, PropTypes.any])
};
