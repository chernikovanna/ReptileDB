import React, { useState } from 'react';

export default function Options(props) {
  const opts = ['Species Counts', 'Species Density', 'Endemic Species'];
  const radioChange = props.radio_change;

  const buttonCheckedStart = 'Species Counts';
  const [type, setType] = useState(buttonCheckedStart);
  const handleChange = (event) => {
    radioChange(event);
    setType(event.target.value);
  };

  const radioRows = opts.map((opt) => (

    <label htmlFor="mapMetric">
      <input
        type="radio"
        name="mapMetric"
        value={opt}
        checked={type === opt}
        onChange={handleChange}
      />
      {opt}
    </label>
  ));

  return (
    <>
    <h4> Data Type </h4>
    {radioRows}
   </>);
}
