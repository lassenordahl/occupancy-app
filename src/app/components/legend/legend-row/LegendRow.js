import React from "react";
import './LegendRow.scss';

function LegendRow(props) {
  return (
    <div className="LegendRow fade-in">
      <div style={{'backgroundColor': props.color}}>
        <div/>
      </div>
      <p>
        {props.range}
      </p>
    </div>
  );
}

export default LegendRow;
