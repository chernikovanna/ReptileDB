import * as d3 from "d3";
import { useState, useEffect } from "react";
import React from "react"

export const useCountryData = function (type) {
  // store loaded map data in a state
  const [countryData, setCountryData] = useState({
    data: {},
    loading: true,
  });

  // only fetch map data once and create a tooltip
  useEffect(() => {
    d3.json("http://localhost:5000/data/countries?type=" + type)
      .then((data) => {
        setCountryData((prevState) => {
          return { ...prevState, data: data, loading: false };
        });
      })
      .catch((err) => {
        console.log("error occurred with loading map", err);
      });

  }, [type]);

  return { countryData };
};
