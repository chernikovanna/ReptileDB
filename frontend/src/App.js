import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import * as d3 from 'd3';

import CountryList from './components/CountryList';
import SpeciesList from './components/SpeciesList';



function App() {

  const [speciesData, setSpeciesData] = useState({
    data: {},
    loading: true,
  });

  const setSpeciesList = function (speciesList) {
    setSpeciesData((prevState) => {
      return { ...prevState, data: speciesList, loading: false };
    });
  };

  return (
      <div id="container">
        <div id="worldmap">
          <CountryList
          species_list={setSpeciesList}/>
        </div>
        <div id="halfpage">
        <SpeciesList
        data={speciesData}/>
        </div>
        <div id="clear"></div>
      </div>);
}


export default App;
