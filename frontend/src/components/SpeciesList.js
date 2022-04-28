import * as d3 from "d3";
import Species from "./Species";

export default function SpeciesList(props) {


  // render map only when map data is fully loaded
  if (!props.data.loading) {
    const speciesBlocks = props.data.data.map((data, index) => {
      return (
        <Species
        specie = {data[0]}
        y_offset = {index * 50}
        />
      );
  });
  const len = speciesBlocks.length * 60

  return (
    <>
      <svg height={len} width="300">
        <g>{speciesBlocks}</g>
      </svg>
    </>
  );



  } else {
    return <h2> Select a Country </h2>;
  }
}
