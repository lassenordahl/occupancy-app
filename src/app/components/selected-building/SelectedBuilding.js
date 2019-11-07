import React from "react";
import './SelectedBuilding.scss';
import NumberFocus from "../../containers/number-focus/NumberFocus";

import { Picklist, PicklistOption } from 'react-rainbow-components';

function SelectedBuilding(props) {

  function renderSelectedBuilding(building) {
    return (
      <div className="building-information">
        <div className="building"></div>
        {/* <h3>
          {building.name}
        </h3>
        <p>
          {building.description}
        </p> */}
        <div className="building-occupancy-count flex-center">
          <NumberFocus subtitle="Total Occupants">
            12
          </NumberFocus>
        </div>  
      </div>
    );
  }

  return (
    <div className="SelectedBuilding" style={props.building !== null ? {'alignItems': 'flex-start'} : null}>
      { props.building === null ?
        <p>No building selected</p>
        :
        renderSelectedBuilding(props.building)
      }
    </div>
  );
}

export default SelectedBuilding;
