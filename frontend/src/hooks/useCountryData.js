import * as d3 from 'd3';
import { useState, useEffect } from 'react';

const COUNTRY_DATA_ENDPOINT = 'http://localhost:5000/data/countries';

const useCountryData = (type) => {
  // store loaded map data in a state
  const [countryData, setCountryData] = useState();
  const [isCountryDataLoading, setIsCountryDataLoading] = useState(true);

  // only fetch map data once and create a tooltip
  useEffect(() => {
    setIsCountryDataLoading(true);

    d3.json(`${COUNTRY_DATA_ENDPOINT}?type=${type}`)
      .then((data) => {
        setCountryData(data);
        setIsCountryDataLoading(false);
      })
      .catch((err) => {
        console.log('error occurred with loading map', err);
      });
  }, [type]);

  return { countryData, isCountryDataLoading };
};

export default useCountryData;
