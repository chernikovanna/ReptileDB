import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import useCountryData from '../hooks/useCountryData';

export default function Key(props) {
  const { select_years: selectYears, select_type: selectType, species_list: speciesList, select_taxa: selectTaxa} = props;
  // step 1: load geoJSON and create tooltip
  const { countryData, isCountryDataLoading } = useCountryData(selectType, selectYears, selectTaxa);
  const [square, setSquare] = useState();

  const generate = () => {
    console.log("square")
    const colorScale = d3.scaleSequential().domain([countryData.min, countryData.max])
      .interpolator(d3.interpolateRgb('purple', 'orange'));
      let rects = d3.range(countryData.min, countryData.max, Math.floor((countryData.max - countryData.min) / 5))
      setSquare(rects.map((rect, i) => {
        return (<rect
        width={15}
        height={15}
        y={15}
        x={i * 20}
        fill={colorScale(rect)}
        />);
      }));
    console.log(square)
  };

  useEffect(() => {
    if (!isCountryDataLoading) {
      generate();
    }
  }, [countryData]);

  // render map only when map data is fully loaded
  if (!isCountryDataLoading) {
    return (
      <svg width="400" height="110">
      {square}
      </svg>
    );
  }

}
