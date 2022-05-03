import './App.css';
import React, { useState } from 'react';
import CountryList from './components/CountryList';
import SpeciesList from './components/SpeciesList';
import Options from './components/Options';
import YearSlider from './components/YearSlider';
import Select from './components/Select';
import Key from './components/Key';
import Download from './components/Download'
import useCountryData from './hooks/useCountryData';


function App() {
  // species list display
  const [speciesData, setSpeciesData] = useState({
    data: {},
    loading: true,
    country_name: "",
  });
  const setSpeciesList = (speciesList, countryName) => {
    setSpeciesData((prevState) => ({ ...prevState, data: speciesList, loading: false, country_name: countryName }));
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
  //taxa
  const [taxa, setTaxa] = useState();
  const handleChangeTaxa = (event) => {
    setTaxa(event);
  }
  //countryData
  const { countryData, isCountryDataLoading } = useCountryData(type, years, taxa);

  //Download stuff
  const handleDownload = (event) => {
    var file_name = speciesData.country_name
    if (taxa){
      file_name = file_name + "_" + taxa
    }
    if (years){
      file_name = file_name + "_" + years[0] + "-" + years[1]
    }
    if (type == "Endemic Species"){
      file_name = file_name + "_" + "Endemic"
    }
    const element = document.createElement("a");
    const file = new Blob(speciesData.data.map((d) => {
      return (d[0] + "\n")
    }), {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = file_name;
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
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
            <Key species_list={setSpeciesList} select_type={type} select_years={years} select_taxa={taxa} cd={countryData} icd={isCountryDataLoading}/>
          </div>

          <div id="dropdown">
            <Select taxa_change={handleChangeTaxa} />
          </div>
          <div id="download" >
            <Download download_change={handleDownload}/>
          </div>
        </div>
      </div>
      <main className="main-container">
        <div id="worldmap" className="container">
          <CountryList species_list={setSpeciesList} select_type={type} select_years={years} select_taxa={taxa} cd={countryData} icd={isCountryDataLoading}/>
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
