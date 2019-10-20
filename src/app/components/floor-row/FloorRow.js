import React from "react";
import './FloorRow.scss';

function FloorRow(props) {
  return (
    <div className="FloorRow" style={props.style}>
      <div className="floor-layout box-shadow" />
      <div className="floor-content">
        <p>Floor: {props.floorNumber}</p>
      </div>
    </div>
  );
}

export default FloorRow;
