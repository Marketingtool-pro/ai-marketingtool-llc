import PropTypes from 'prop-types';
// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

/***************************  COMMON - TYPESET  ***************************/

export default function Typeset({ heading, caption, stackProps, headingProps, captionProps }) {
  const { sx: stackPropsSx, ...stackPropsRest } = stackProps || {};
  const { sx: headingPropsSx, ...headingPropsRest } = headingProps || {};
  const { sx: captionPropsSx, ...captionPropsRest } = captionProps || {};

  return (
    <Stack {...stackPropsRest} sx={{ gap: 0.5, ...stackPropsSx }}>
      <Typography variant="h6" {...headingPropsRest} sx={{ fontWeight: 400, ...headingPropsSx }}>
        {heading}
      </Typography>
      {caption && (
        <Typography variant="body2" {...captionPropsRest} sx={{ color: 'grey.700', ...captionPropsSx }}>
          {caption}
        </Typography>
      )}
    </Stack>
  );
}

Typeset.propTypes = {
  heading: PropTypes.string,
  caption: PropTypes.string,
  stackProps: PropTypes.any,
  headingProps: PropTypes.any,
  captionProps: PropTypes.any
};
