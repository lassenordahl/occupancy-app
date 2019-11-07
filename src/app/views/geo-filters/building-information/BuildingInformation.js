import React, {useState} from "react";
import './BuildingInformation.scss';

import {
  SelectedBuilding,
  FloorRow
} from 'app/components';

import { DatePicker, Button, Picklist, PicklistOption } from 'react-rainbow-components';
import { Trail } from 'react-spring/renderprops';

function BuildingInformation(props) {
  
  const [selectedFloor, setSelectedFloor] = useState(null);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  function mapFloorOptions(floorCount) {
    return [...Array(floorCount).keys()].map(function(number) {
      return number + 1;
    });
  }

  function selectFloor(floor) {
    setSelectedFloor(floor);
    props.history.push('/geolocation/' + props.building.buildingId + '/floor/' + floor.value);
  }

  console.log(props.building);

  return (
    <div className="RealTimeGeo">
      <h2>
        Date Range
      </h2>
      <DatePicker
        label="from"
        value={fromDate}
      />
      <div style={{'height': '16px'}}/>
      <DatePicker
        label="to"
        value={toDate}
      />
      <div style={{'height': '24px'}}/>
      <h2>
        Selected Building
      </h2>
      <SelectedBuilding 
        building={props.building}
      ></SelectedBuilding>    
      <div style={{'height': '24px'}}/>
      <h2>
        Select a Floor
      </h2>
      {/* <Select 
        options={mapFloorOptions(props.building.floorCount)}
        value={selectedFloor}
        placeholder="hello"
      /> */}
      <Picklist
        value={selectedFloor}
        onChange={value => selectFloor(value)}
        placeholder="Select a floor"
      >
        {mapFloorOptions(props.building.floorCount).map(function(floorNumber, index) {
          return ( 
            <PicklistOption key={index} name={"Floor " + floorNumber} label={"Floor " + floorNumber} value={floorNumber}/>
          );
        })}
       
      </Picklist>
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
