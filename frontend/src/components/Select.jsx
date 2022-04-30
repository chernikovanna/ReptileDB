import React from 'react';
import PropTypes from 'prop-types';

export default function Select(props) {
  const { name, onSelect, options } = props;
  return (
    <select name={name} onChange={onSelect}>
      {options.map((value) => <option value={value}>{value}</option>)}
    </select>
  );
}

Select.propTypes = {
  name: PropTypes.string.isRequired,
  onSelect: PropTypes.func.isRequired,
  options: PropTypes.arrayOf(PropTypes.string).isRequired,
};
