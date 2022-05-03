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

    return (
      <>
      <h4> Taxa </h4>
      <SelectPicker
      cleanable={false}
      data={data}
      defaultValue="All Taxas"
      onChange ={handleChange}
      placement="bottomEnd"
      disabled={false}
      />
      </>
    );
  }
}
