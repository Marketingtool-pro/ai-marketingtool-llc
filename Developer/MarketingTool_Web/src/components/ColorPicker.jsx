import PropTypes from 'prop-types';
import { useRef, useState } from 'react';

// @mui
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

/***************************  COLOR PICKER  ***************************/

export default function ColorPicker({ label, defaultColor, viewOnly, onColorChange }) {
  const [color, setColor] = useState(defaultColor || '#000000');

  const colorInputRef = useRef(null); // Reference to the color input element

  const handleClick = () => {
    if (colorInputRef.current) {
      colorInputRef.current.click(); // Simulate a click on the hidden color input
    }
  };

  const handleColorChange = (e) => {
    setColor(e.target.value); // Update color when user selects a new color
    if (onColorChange) onColorChange(e.target.value);
  };

  return (
    <Stack position="relative" direction="row" sx={{ alignItems: 'center', gap: 1.5 }}>
      <Box
        sx={{ width: 46, height: 46, borderRadius: 2, bgcolor: color, ...(!viewOnly && { cursor: 'pointer' }) }}
        {...(!viewOnly && { onClick: handleClick })}
      />
      {!viewOnly && (
        <input
          type="color"
          ref={colorInputRef}
          value={color}
          onChange={handleColorChange}
          aria-label="color picker"
          style={{
            position: 'absolute',
            opacity: 0,
            width: 60,
            height: 60,
            pointerEvents: 'none' // Prevent interaction directly
          }}
        />
      )}
      <Stack sx={{ gap: 1 }}>
        {label && <Typography variant="body2">{label}</Typography>}
        <Typography variant="body2" color="grey.700" sx={{ textTransform: 'uppercase' }}>
          {color}
        </Typography>
      </Stack>
    </Stack>
  );
}

ColorPicker.propTypes = {
  label: PropTypes.string,
  defaultColor: PropTypes.string,
  viewOnly: PropTypes.bool,
  onColorChange: PropTypes.func
};
