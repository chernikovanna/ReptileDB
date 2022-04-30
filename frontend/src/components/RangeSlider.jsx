import React from 'react';
import PropTypes from 'prop-types';

export default function RangeSlider(props) {
  const { max, min, onSliderChange } = props;
  return (
    <input type="range" min={min} max={max} step="1" className="slider" onChange={onSliderChange} />
  );
}

RangeSlider.propTypes = {
  max: PropTypes.number.isRequired,
  min: PropTypes.number.isRequired,
  onSliderChange: PropTypes.func.isRequired,
};
