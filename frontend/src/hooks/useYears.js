import { useState, useEffect } from 'react';
import * as d3 from 'd3';

export const useYears = function () {
  // store loaded map data in a state
  const [yearData, setYearData] = useState({
    data: {},
    loading: true,
  });

  // only fetch map data once and create a tooltip
  useEffect(() => {
    d3.json("http://localhost:5000/data/year")
      .then((data) => {
        setYearData((prevState) => {
          return { ...prevState, data: data, loading: false };
        });
      })
      .catch((err) => {
        console.log("error occurred with loading years", err);
      });

  }, []);

  return { yearData };
};
