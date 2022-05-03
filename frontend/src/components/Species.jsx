import {
  handleMouseOver,
  handleMouseOut,
  handleMouseMove,
} from "../helpers/handleTooltip";
import * as d3 from "d3";



export default function Species(props) {
  const name = props.specie
  const y_offset = props.y_offset

  return (
    <g>
       <rect x="12" y={y_offset} width="250" height="30" fill="white"></rect>
       <text x="15" y={y_offset + 20} fontFamily="Verdana" fontSize="20" fill="Black">{name}</text>
     </g>
  );
}
