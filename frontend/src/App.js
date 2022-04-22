import './App.css';
import React, { useEffect, useState } from 'react';
import axios from 'axios'
import * as d3 from 'd3';

import CountryList from './components/CountryList';



function App() {

  return (
      <div id="container">
        <div id="worldmap">
          <CountryList/>
        </div>
        <div id="halfpage">
        </div>
        <div id="clear"></div>
      </div>);
}


export default App;
