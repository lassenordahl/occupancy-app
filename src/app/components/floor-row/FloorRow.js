import React from "react";
import './FloorRow.scss';

function FloorRow(props) {
  console.log(props.openFloor);
  return (
    <div className="FloorRow" style={props.style}>
      <div className="floor-layout box-shadow" />
      <div className="floor-content" onClick={() => props.openFloor(props.floorNumber)}>
        <p>Floor: {props.floorNumber}</p>
      </div>
    </div>
  );
}

export default FloorRow;
