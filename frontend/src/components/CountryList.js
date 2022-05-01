import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import { SpinnerRound } from 'spinners-react';
import { setMapProjection } from '../helpers/setMapProjection';
import useMapTools from '../hooks/useMapTools';
import useCountryData from '../hooks/useCountryData';
import Country from './Country';

export default function CountryList(props) {
  const { select_type: selectType, species_list: speciesList } = props;
  // step 1: load geoJSON and create tooltip
  const { mapData, isMapDataLoading } = useMapTools();
  const { countryData, isCountryDataLoading } = useCountryData(selectType);
  const [mapHealthRegions, setMapHealthRegions] = useState();

  const generateMap = () => {
    const colorScale = d3.scaleSequential().domain([countryData.min, countryData.max])
      .interpolator(d3.interpolateRgb('purple', 'orange'));
    const path = d3.geoPath().projection(setMapProjection(mapData.data));

    // for each geoJSON coordinate, compute and pass in the equivalent svg path
    const healthRegions = mapData.features.map((data) => {
      const regionName = data.properties.name;
      const countryDataList = countryData.countries[data.id];
      let fill = 'rgb(128, 128, 128)';

      if (countryDataList) {
        if (selectType === 'Species Counts' || selectType === 'Endemic Species') {
          fill = colorScale(countryDataList.length);
        } else if (selectType === 'Species Density') {
          const densities = countryDataList.map((specie) => specie[1]);
          fill = colorScale(densities.reduce((partialSum, a) => partialSum + a, 0));
        }
      }

      return (
        <Country
          key={data.id}
          path={path(data)}
          tooltipData={regionName}
          code={fill}
          data={countryDataList}
          species_list={speciesList}
        />
      );
    });

    setMapHealthRegions(healthRegions);
  };

  useEffect(() => {
    if (!isMapDataLoading && !isCountryDataLoading) {
      generateMap();
    }
  }, [mapData, countryData]);

  // render map only when map data is fully loaded
  if (!isMapDataLoading && !isCountryDataLoading && mapHealthRegions) {
    return (
      <div className="map-container">
        <svg className="map-canvas" preserveAspectRatio="xMinYMin meet" viewBox="0 0 1000 800">
          <g>{mapHealthRegions}</g>
        </svg>
      </div>
    );
  }

  return <SpinnerRound />;
}
