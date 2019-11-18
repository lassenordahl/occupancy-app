import React from "react";
import './SelectedBuilding.scss';
import NumberFocus from "../../containers/number-focus/NumberFocus";

import { Picklist, PicklistOption } from 'react-rainbow-components';
import { D3Shape } from 'app/components';

function SelectedBuilding(props) {

  function renderSelectedBuilding(building) {
    return (
      <div className="building-information">
        <D3Shape coordinates={building.coordinates}/>
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
