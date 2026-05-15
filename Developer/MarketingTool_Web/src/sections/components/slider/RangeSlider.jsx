import PropTypes from 'prop-types';
import { useState } from 'react';

// @mui
import Slider from '@mui/material/Slider';

/***************************  SLIDER - VALUETEXT  ***************************/

function valueLabelFormat(value) {
  return `${value}°C`;
}

/***************************  SLIDER - BASIC  ***************************/

export default function RangeSlider({ defaultValue, ...rest }) {
  const [value, setValue] = useState(defaultValue || [20, 37]);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Slider
        getAriaLabel={() => 'Temperature range'}
        value={value}
        onChange={handleChange}
        valueLabelDisplay="auto"
        getAriaValueText={valueLabelFormat}
        valueLabelFormat={valueLabelFormat}
        {...rest}
      />
    </>
  );
}

RangeSlider.propTypes = { defaultValue: PropTypes.any, rest: PropTypes.any };
