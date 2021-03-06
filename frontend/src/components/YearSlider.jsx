import React from 'react';
import {useYears} from '../hooks/useYears';
import { Slider, RangeSlider } from 'rsuite';
import "rsuite/dist/rsuite.min.css";


export default function YearSlider(props){
  const years = useYears();
  if (!years.loading){
    return(
      <>
      <h4>Years</h4>
      <br/>
      <div>
        <RangeSlider
        defaultValue={[years.data.min, years.data.max]}
        max={years.data.max}
        min={years.data.min}
        onChangeCommitted={props.range_change}
        step={1}
        barClassName="slider-colors"
        handleClassName="slider-handle-colors"/>
      </div>
      </>
    )
}


};
