import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import * as d3 from 'd3';

import CountryList from './components/CountryList';
import SpeciesList from './components/SpeciesList';
import Options from './components/Options';



function App() {
  // species list display
  const [speciesData, setSpeciesData] = useState({
    data: {},
    loading: true,
  });

  const button_checked_start = 'Species Counts'
  const [type, setType] = React.useState(button_checked_start);

  const setSpeciesList = function (speciesList) {
    setSpeciesData((prevState) => {
      return { ...prevState, data: speciesList, loading: false };
    });
  };

  const handleChange = (event) => {
    setType(event.target.value)
 }



  return (
    <>
    <div><h1> Reptiles Species Global Checklist </h1></div>
    <div id="container_two">
      <div id="options">
        <Options
          radio_change = {handleChange}
          />
      </div>
      <div id="slider">
      </div>
      <div id="key">
      </div>
      <div id="dropdown">
      </div>
      <div id="download">
      </div>
    </div>
      <div id="container">
        <div id="worldmap">
          <CountryList
          species_list={setSpeciesList}
          select_type={type}/>
        </div>
        <div id="halfpage">
          <SpeciesList
          data={speciesData}/>
        </div>
        <div id="clear"></div>
      </div>
    </>);

}


export default App;
