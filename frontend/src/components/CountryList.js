import * as d3 from "d3";
import { setMapProjection } from "../helpers/setMapProjection";
import { useMapTools } from "../hooks/useMapTools";
import Country from "./Country";

export default function CountryList(props) {
  // step 1: load geoJSON and create tooltip
  const {mapData} = useMapTools();

  // render map only when map data is fully loaded
  if (!mapData.loading) {
    // step 2: render the regions
    // compute a path function based on correct projections that we will use later
    const path = d3.geoPath().projection(setMapProjection(mapData.data));
    // for each geoJSON coordinate, compute and pass in the equivalent svg path
    const healthRegions = mapData.data.features.map((data) => {
      const region_name = data.properties["NAME_ENG"];
      return (
        <Country
          key={data.properties.FID}
          path={path(data)}
          tooltipData={region_name}
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
