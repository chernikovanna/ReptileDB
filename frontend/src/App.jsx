import './App.css';
import React, { useState } from 'react';
import CountryList from './components/CountryList';
import SpeciesList from './components/SpeciesList';
import Options from './components/Options';
import YearSlider from './components/YearSlider';
import Select from './components/Select';
import Key from './components/Key';

function App() {
  // species list display
  const [speciesData, setSpeciesData] = useState({
    data: {},
    loading: true,
  });
  const setSpeciesList = (speciesList) => {
    setSpeciesData((prevState) => ({ ...prevState, data: speciesList, loading: false }));
  };
  // radio buttons
  const buttonCheckedStart = 'Species Counts';
  const [type, setType] = useState(buttonCheckedStart);
  const handleChange = (event) => {
    setType(event.target.value);
  };

  //Years
  const [years, setYears] = useState();
  const handleChangeYears = (event) => {
    setYears(event);
  };

  const [taxa, setTaxa] = useState();
  const handleChangeTaxa = (event) => {
    setTaxa(event);
  }

  return (
    <>
      <header>
        <h1>Reptiles Species Global Checklist</h1>
      </header>
      <div className="controls-container">
        <div className="container" id="controls">
          <div id="options">
            <Options radio_change={handleChange} />
          </div>
          <div id="slider">
            <YearSlider range_change={handleChangeYears} />
          </div>
          <div id="key">
            <Key species_list={setSpeciesList} select_type={type} select_years={years} select_taxa={taxa} />
          </div>

          <div id="dropdown">
            <Select taxa_change={handleChangeTaxa} />
          </div>
          <div id="download" />
        </div>
      </div>
      <main className="main-container">
        <div id="worldmap" className="container">
          <CountryList species_list={setSpeciesList} select_type={type} select_years={years} select_taxa={taxa} />
        </div>
        <div id="halfpage" className="container">
          <SpeciesList data={speciesData} />
        </div>
        <div id="clear" />
      </main>
    </>
  );
}

export default App;
