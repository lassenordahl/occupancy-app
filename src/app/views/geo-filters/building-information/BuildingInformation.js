import React, {useState} from "react";
import './BuildingInformation.scss';
import '../GeoFilter.scss';

import {
  SelectedBuilding,
} from 'app/components';

import { DatePicker, Button, Picklist, PicklistOption, CheckboxToggle } from 'react-rainbow-components';

function BuildingInformation(props) {
  
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [realtime, setRealtime] = useState(false);
  const [fromDate] = useState(new Date());
  const [toDate] = useState(new Date());

  function mapFloorOptions(floorCount) {
    return [...Array(floorCount).keys()].map(function(number) {
      return number + 1;
    });
  }

  function selectFloor(floor) {
    setSelectedFloor(floor);
    props.openFloor(floor.value);
  }

  return (
    <div className="RealTimeGeo">
      <div className="header-toggle">
        <h2>Date Range</h2>
        <CheckboxToggle
          value={realtime}
          onChange={(event) => setRealtime(!realtime)}
        />
      </div>     
      <DatePicker
        label="from"
        value={fromDate}
        disabled={!realtime}
      />
      <div style={{'height': '16px'}}/>
      <DatePicker
        label="to"
        value={toDate}
        disabled={!realtime}
      />
      
      <div style={{'height': '24px'}}/>
      
      <h2>Select a Floor</h2>
      <Picklist
        value={selectedFloor}
        onChange={value => selectFloor(value)} // Value.value is the floor number (weird nami
        placeholder="Select a floor"
      >
        {mapFloorOptions(props.building.floorCount).map(function(floorNumber, index) {
          return ( 
            <PicklistOption key={index} name={"Floor " + floorNumber} label={"Floor " + floorNumber} value={floorNumber}/>
          );
        })}
      </Picklist>

      <div style={{'height': '24px'}}/>
      
      <h2>Selected Building</h2>
      <SelectedBuilding 
        building={props.building}
        realtime={realtime}
      ></SelectedBuilding>    
   
      <Button
        variant="brand"
        className="box-shadow color-blue"
        style={{'marginTop': 'auto', 'alignSelf': 'center'}}
        onClick={() => props.openDialog('building', props.building.name, "Detailed building view")}
        label="Building Data"
      >
      </Button>
    </div>
  );
}

export default BuildingInformation;
