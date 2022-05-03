import * as d3 from 'd3';
import React, { useEffect, useState } from 'react';
import useCountryData from '../hooks/useCountryData';
import FileDownloadIcon from '@rsuite/icons/FileDownload';
import IconButton from 'rsuite/IconButton';

export default function Download(props) {


  return (
    <>
    <IconButton icon={<FileDownloadIcon style={{fontSize: "40px"}}/>}  onClick={props.download_change}/>
  </>);
}
