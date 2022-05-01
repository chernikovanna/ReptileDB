import './App.css';
import React, { useState } from 'react';
import CountryList from './components/CountryList';
import SpeciesList from './components/SpeciesList';
import Options from './components/Options';
import RangeSlider from './components/RangeSlider';
import Select from './components/Select';
import { useYears } from './hooks/useYears';

function App() {
  // species list display
  const [speciesData, setSpeciesData] = useState({
    data: {},
    loading: true,
  });
  const setSpeciesList = (speciesList) => {
    setSpeciesData((prevState) => ({ ...prevState, data: speciesList, loading: false }));
  };
  const buttonCheckedStart = 'Species Counts';
  const [type, setType] = useState(buttonCheckedStart);
  const handleChange = (event) => {
    setType(event.target.value);
  };

  const initYears = useYears();
  console.log(initYears)
  const [years, setYears] = useState((initYears.data.min, initYears.data.max));
  const handleChangeYears = (event) => {
    setYears(event.target.value);
  };

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
            <RangeSlider min={years.min} max={years.max} onSliderChange={handleChangeYears} />
          </div>
          <div id="key" />
          <div id="dropdown">
            <Select name="speciesSelect" options={[]} onSelect={() => {}} placeholder="Select a specie..." />
          </div>
          <div id="download" />
        </div>
      </div>
      <main className="main-container">
        <div id="worldmap" className="container">
          <CountryList species_list={setSpeciesList} select_type={type} />
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
