import React, { useState, useEffect } from "react";
import './Home.scss';

import 'leaflet/dist/leaflet.css';
import { Route } from 'react-router-dom';
import { Trail } from 'react-spring/renderprops';
import axios from 'axios';

import {
  Card,
  Dialog
} from 'app/containers';

import {
  Legend,
  CoordinateMap,
  FloorMap
} from 'app/components';

import { 
  BuildingInformation,
  GlobalInformation,
  FloorInformation,
  OccupancyDialog,
} from 'app/views';

function Home(props) {

  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState('building');
  const [dialogTitle, setDialogTitle] = useState('default');
  const [dialogTitleSubscript, setDialogTitleSubscript] = useState('default');


  const [building, setBuilding] = useState(null);
  const [floorNumber, setFloorNumber] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    // let urlBuildingId = props.match.params.buildingId;
    let floorId = props.match.params.floorId;
    // alert(props.match.params.buildingId);
    // alert(props.match.params.floorId);
    if (floorId === undefined) {
      setFloorNumber(null);
    } else {
      setFloorNumber(floorId);
    }
    // if url building id is not in the valid id's then we can just set it to be nothing
  }, [props.match.params.buildingId, props.match.params.floorId]);  

  function selectBuilding(building) {
    setBuilding(null);
    setBuilding(building);
    props.history.push('/geolocation/' + building.buildingId);
  }

  function selectRoom(room) {
    setRoom(room);
    if (building !== undefined && building !== null) {
      props.history.push('/geolocation/' + building.buildingId + '/floor/' + floorNumber + '/room/' + room.name);
    } else {
      alert('Building is null');
    }
  }

  function resetBuilding() {
    setBuilding(null);
    props.history.push('/geolocation');
  }

  function resetSelectedBuilding() {
    if (building !== undefined && building !== null) {
      props.history.push('/geolocation/' + building.buildingId);
    } else {
      alert('Null building url');
    }
  }

  function openFloor(floorNumber) {
    setFloorNumber(floorNumber);
    props.history.push('/geolocation/' + building.buildingId + '/floor/' + floorNumber);
  }

  function openDialog(buildingType, title, titleSubscript) {
    setDialogType(buildingType);
    setDialogTitle(title);
    setDialogTitleSubscript(titleSubscript);
    setShowDialog(true);
  }

  function conditionalGeolocationInformation() {
    return (
      <React.Fragment>
        { building !== null ?
          <BuildingInformation 
            building={building}
            openFloor={openFloor}
            history={props.history}
            openDialog={openDialog}
          /> 
          :
          <GlobalInformation
            openDialog={openDialog}
          />
        }
      </React.Fragment>
    );
  }

  function conditionalFloorInformation() {
    console.log('rendering floor', room);
    return (
      <React.Fragment>
        { room !== null ?
          <FloorInformation
            room={room}
            openDialog={openDialog}
          />
          : <div>
            <h2>Floor Selection</h2>
            <p>
              Here you can select a floor for the specified building
            </p>
          </div>
        }
    
      </React.Fragment>
    );
  }

  function conditionalMap() {
    return (<CoordinateMap selectBuilding={selectBuilding} appEntity={props.appEntity}></CoordinateMap>);
  }

  function conditionalFloorMap() {
    return (<FloorMap selectRoom={selectRoom}></FloorMap>);
  }

  function conditionalGeolocationTitle() {
    return (
      <React.Fragment>
        <h1 onClick={() => resetBuilding()}>
          UCI
        </h1>
        { building !== null ?
          <p>&nbsp;&nbsp;>&nbsp;&nbsp;{building.name}</p>
          : null
        }
      </React.Fragment>
    );
  }

  function conditionalFloorTitle() {
    return (
      <React.Fragment>
        <h1 onClick={() => resetSelectedBuilding()}>
          { building !== null ? building.name : 'Default'}
        </h1>
        <p>&nbsp;&nbsp;>&nbsp;&nbsp;Floor {floorNumber}</p>    
      </React.Fragment>
    );
  }

  function renderDialogView(type) {
    return <OccupancyDialog/>
    // if (type === "building") {
    //   return <BuildingDialog/>
    // } else if (type === "global") {
    //   return <GlobalDialog />
    // } else if (type === "floor") {
    //   return <FloorDialog/>
    // }
  }
  
  return (
    <div className="Home">
      { floorNumber === null ? conditionalMap() : conditionalFloorMap() }
      {/* <Route exact path="/geolocation/:buildingId?" component={}></Route>
      <Route exact path="/geolocation/:buildingId/floor/:floorId" component={conditionalFloorMap}></Route> */}
      {showDialog ?
        <Dialog 
          className="dialog" 
          closeDialog={() => setShowDialog(false)}
          title={dialogTitle}
          titleSubscript={dialogTitleSubscript}
        >
          {renderDialogView(dialogType)}
        </Dialog>
      : null}
      <Card className="legend-card" style={{width: '280px'}}>
        <div className="legend-header">
          <h1>
            Legend
          </h1>
        </div>
        <div className="legend-content">
            <Legend></Legend>
          </div>
      </Card>
      <Card className="information-card" style={{width: '400px'}}>
        <div className="information-header">
          <Route exact path="/geolocation/:buildingId?" component={conditionalGeolocationTitle}></Route>
          <Route exact path="/geolocation/:buildingId/floor/:floorId/(room)?/:roomId?" component={conditionalFloorTitle}></Route>
        </div>
        <div className="information-tab-content">
          <Route exact path="/geolocation/:buildingId?" component={conditionalGeolocationInformation}></Route>
          <Route exact path="/geolocation/:buildingId/floor/:floorId/(room)?/:roomId?" component={conditionalFloorInformation}></Route>
        </div>
      </Card>
    </div>
  );
}

export default Home;
