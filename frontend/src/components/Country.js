import {
  handleMouseOver,
  handleMouseOut,
  handleMouseMove,
} from "../helpers/handleTooltip";
import * as d3 from "d3";



export default function Country(props) {
  const { path, tooltipData } = props;
  const color = props.code
  const setSpeciesList = props.species_list

  return (
    <path
      className="path"
      d={path}
      fill={color}
      onMouseOver={() => {
        handleMouseOver(tooltipData);
      }}
      onMouseOut={handleMouseOut}
      onMouseMove={(event) => {
        handleMouseMove(event);
      }}
      onClick={() => {setSpeciesList(props.data);}}
    />
  );
}
