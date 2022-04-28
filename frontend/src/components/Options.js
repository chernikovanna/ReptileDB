import React, { useEffect, useState } from 'react';

import * as d3 from "d3";



export default function Options(props) {
  const opts = ["Species Counts", "Species Density", "Endemic Species"];
  const radioChange = props.radio_change

  const button_checked_start = 'Species Counts'
  const [type, setType] = React.useState(button_checked_start);
  const handleChange = (event) => {
    radioChange(event)
    setType(event.target.value)

 }



  var radioRows = opts.map((opt) => {
    return <tr>
      <input
        type="radio"
        name="site_name"
        value={opt}
        checked={type === opt}
        onChange={handleChange}
      />
      {opt}
    </tr>
  })

  return (
    <tbody>
      {radioRows}
    </tbody>
  );
}
