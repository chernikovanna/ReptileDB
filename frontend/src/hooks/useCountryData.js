import * as d3 from "d3";
import { useState, useEffect } from "react";

export const useCountryData = function () {
  // store loaded map data in a state
  const [countryData, setCountryData] = useState({
    data: {},
    loading: true,
  });

  // only fetch map data once and create a tooltip
  useEffect(() => {
    d3.json("http://localhost:5000/data/countries")
      .then((data) => {
        setCountryData((prevState) => {
          return { ...prevState, data: data, loading: false };
        });
      })
      .catch((err) => {
        console.log("error occurred with loading map", err);
      });

  }, []);

  return { countryData };
};
