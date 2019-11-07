import React from "react";
import './BuildingInformation.scss';

import {
  SelectedBuilding,
  FloorRow
} from 'app/components';

import { DatePicker, Button, Select } from 'react-rainbow-components';
import { Trail } from 'react-spring/renderprops';

function BuildingInformation(props) {
  
  let selectedFloor = null;

  function mapFloorOptions(floorCount) {
    return [...Array(floorCount).keys()].map(function(number) {
      return {
        value: number + 1, 
        label: 'Floor ' + (number + 1),
      };
    });
  }

  return (
    <div className="RealTimeGeo">
      <h2>
        Date Range
      </h2>
      <DatePicker
        label="from"
      />
      <div style={{'height': '16px'}}/>
      <DatePicker
        label="to"
      />
      <div style={{'height': '24px'}}/>
      <h2>
        Selected Building
      </h2>
      <SelectedBuilding building={props.building}></SelectedBuilding>    
      <div style={{'height': '24px'}}/>
      <h2>
        Select a Floor
      </h2>
      <Select 
        options={mapFloorOptions(props.building.floorCount)}
        value={selectedFloor}
        placeholder="hello"
      />
      {/* { props.building !== null ? 
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
      } */}
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
