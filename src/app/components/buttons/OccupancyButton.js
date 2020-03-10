import React from "react";
import "./OccupancyButton.scss";

function OccupancyButton(props) {
  return (
    <div
      className={
        "OccupancyButton box-shadow " +
        props.className +
        (props.isColored ? " occupancy-button-blue" : " occupancy-button-white")
      }
      style={props.style}
      onClick={props.onClick}
    >
      <p>{props.label}</p>
    </div>
  );
}

export default OccupancyButton;
