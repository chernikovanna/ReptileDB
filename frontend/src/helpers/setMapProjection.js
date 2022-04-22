import * as d3 from "d3";

export const setMapProjection = function(mapData) {
  // use the geoAlbers map projection
  const projection = d3.geoMercator();
  // adjust projection to fit area of map canvas
  projection.scale(150)
  .center([0,0])
  .translate([1000 / 2, 800 / 2]);
  return projection;
};
