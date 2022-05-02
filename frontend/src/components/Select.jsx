import React from 'react';
import { SelectPicker } from 'rsuite';
import {useTaxa} from '../hooks/useTaxa';


export default function Select(props) {

  const handleChange = props.taxa_change
  const taxas = useTaxa();
  if(!taxas.loading){
    const data = taxas.data.map((taxa) => {
      let t = {label: taxa, value: taxa};
      return(t);

    });
    console.log(data)

    return (
      <SelectPicker
      cleanable={(false)}
      data={data}
      defaultValue="All Taxas"
      onChange ={handleChange}/>
    );
  }
}
