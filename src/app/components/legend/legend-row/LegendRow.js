import React from "react";
import './LegendRow.scss';

function LegendRow(props) {
  return (
    <div className="LegendRow">
      <div style={{'backgroundColor': props.color}}/>
      <p>
        {props.range} Occupants
      </p>
    </div>
  );
}

export default LegendRow;
