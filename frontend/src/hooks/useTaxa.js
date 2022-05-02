import { useState, useEffect } from 'react';
import * as d3 from 'd3';

export const useTaxa = function () {
  // store loaded map data in a state
  const [taxaData, setTaxaData] = useState({
    data: {},
    loading: true,
  });
  // only fetch map data once and create a tooltip
  useEffect(() => {
    console.log("here")

    d3.json("http://localhost:5000/data/taxas")
      .then((data) => {
        console.log(data)
        setTaxaData((prevState) => {

          return { ...prevState, data: data, loading: false };

        });
      })
      .catch((err) => {
        console.log("error occurred with loading taxas", err);
      });

  }, []);

  return  taxaData ;
};
