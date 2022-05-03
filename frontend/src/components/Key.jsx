import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import useCountryData from '../hooks/useCountryData';

export default function Key(props) {
  const { select_years: selectYears, select_type: selectType, species_list: speciesList, select_taxa: selectTaxa, cd: countryData, icd: isCountryDataLoading} = props;
  // step 1: load geoJSON and create tooltip
  const [square, setSquare] = useState();
  const [texts, setTexts] = useState();

  const generate = () => {
    const colorScale = d3.scaleSequential().domain([countryData.min, countryData.max])
      .interpolator(d3.interpolate("#649173", "#F9ED85"));
    let rects = d3.range(countryData.min, countryData.max, Math.floor((countryData.max - countryData.min) / 4))
    rects.push(countryData.max)
    setSquare(rects.map((rect, i) => {
      return (<rect
      width={15}
      height={15}
      y={15}
      x={10 + (i * 30)}
      fill={colorScale(rect)}
      />);
    }));
    setTexts(rects.map((rect, i) => {
      return (<text x={10 + (i * 30)} y={50}>{rect}</text>)

    }));

  };

  useEffect(() => {
    if (!isCountryDataLoading) {
      generate();
    }
  }, [countryData]);

  // render map only when map data is fully loaded
  if (!isCountryDataLoading) {
    console.log(selectType)
    return (
      <>
      <h4>{selectType}</h4>
      <svg width="200" height="50">
      {square}
      {texts}
      </svg>
      </>
    );
  } else{
    return (<svg width="200" height="50"></svg>);
  }

}
