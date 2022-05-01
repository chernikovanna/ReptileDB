import * as d3 from 'd3';
import { useState, useEffect } from 'react';

const useMapTools = () => {
  // store loaded map data in a state
  const [mapData, setMapData] = useState();
  const [isMapDataLoading, setIsMapDataLoading] = useState(true);

  // only fetch map data once and create a tooltip
  useEffect(() => {
    setIsMapDataLoading(true);

    d3.json('http://localhost:5000/data/world')
      .then((data) => {
        setMapData(data);
        setIsMapDataLoading(false);
      })
      .catch((err) => {
        console.log('error occurred with loading map', err);
      });

    /// tooltip creation
    d3.select('body')
      .append('div')
      .attr('id', 'tooltip')
      .attr('style', 'position: absolute; opacity: 0');
    ///
  }, []);

  return { mapData, isMapDataLoading };
};

export default useMapTools;
