import React from "react";
import './BuildingInformation.scss';

import {
  SelectedBuilding,
  FloorRow
} from 'app/components';

import { Trail } from 'react-spring/renderprops';
import { Button } from 'react-rainbow-components';

function BuildingInformation(props) {

  return (
    <div className="RealTimeGeo">
      <h2>
        Selected Building
      </h2>
      <SelectedBuilding building={props.building}></SelectedBuilding>    
      { props.building !== null ? 
        <React.Fragment>
          <h2>
            Floors
          </h2>
          <div style={{'overflowY': 'scrool'}}>
            <Trail
              items={[...Array(props.building.floorCount).keys()]}
              keys={item => item} 
              from={{opacity: 0}} 
              to={{opacity: 1}}
              duration={4000}
            >
              {item => styleprops => 
                <FloorRow style={styleprops} floorNumber={item} openFloor={props.openFloor}></FloorRow>
              }
            </Trail> 
          </div>
        </React.Fragment>
        : null
      }
      <Button
        variant="brand"
        className="box-shadow color-blue"
        style={{'marginTop': 'auto', 'alignSelf': 'center'}}
        onClick={() => props.setShowDialog(true)}
      >
        Show Map Data
      </Button>
    </div>
  );
}

export default BuildingInformation;
