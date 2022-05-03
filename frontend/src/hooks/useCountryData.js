import * as d3 from 'd3';
import { useState, useEffect } from 'react';

const COUNTRY_DATA_ENDPOINT = 'http://localhost:5000/data/countries';

const useCountryData = (type, years, taxa) => {
  // store loaded map data in a state
  const [countryData, setCountryData] = useState();
  const [isCountryDataLoading, setIsCountryDataLoading] = useState(true);


  // only fetch map data once and create a tooltip
  useEffect(() => {
    setIsCountryDataLoading(true);
    let min;
    let max;
    if(years){
      min = years[0]
      max = years[1]
    }
    let taxa_in = "All Taxas"
    if (taxa){
      taxa_in = taxa
    }


    d3.json(`${COUNTRY_DATA_ENDPOINT}?type=${type}&year_start=${min}&year_fin=${max}&taxa=${taxa_in}`)
      .then((data) => {
        setCountryData(data);
        setIsCountryDataLoading(false);
      })
      .catch((err) => {
        console.log('error occurred with loading map', err);
      });
  }, [type, years, taxa]);

  return { countryData, isCountryDataLoading };
};

export default useCountryData;
