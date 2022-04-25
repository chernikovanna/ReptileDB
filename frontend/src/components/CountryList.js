import * as d3 from "d3";
import { setMapProjection } from "../helpers/setMapProjection";
import { useMapTools } from "../hooks/useMapTools";
import { useCountryData } from "../hooks/useCountryData";
import Country from "./Country";

export default function CountryList(props) {
  // step 1: load geoJSON and create tooltip
  const {mapData} = useMapTools();
  const {countryData} = useCountryData();

  // render map only when map data is fully loaded
  if (!mapData.loading && !countryData.loading) {
    // step 2: render the regions
    // compute a path function based on correct projections that we will use later
    var colorScale = d3.scaleSequential().domain([countryData.data.min,countryData.data.max]).
    interpolator(d3.interpolateRgb("purple", "orange"));
    const path = d3.geoPath().projection(setMapProjection(mapData.data));

    // for each geoJSON coordinate, compute and pass in the equivalent svg path
    const healthRegions = mapData.data.features.map((data) => {
      const region_name = data.properties.name;
      const country_data_list = countryData.data.countries[data.id.toLowerCase()]
      var fill = "rgb(128, 128, 128)"
      if (country_data_list){
        var fill = colorScale(country_data_list.length)
      }
      return (
        <Country
          key={data.id}
          path={path(data)}
          tooltipData={region_name}
          code={fill}
          data = {country_data_list}
          species_list = {props.species_list}
        />
      );
    });

    return (
      <>
        <svg className="map-canvas" viewBox="0 0 1000 800">
          <g>{healthRegions}</g>
        </svg>
      </>
    );
  } else {
    return <h1> loading </h1>;
  }
}
