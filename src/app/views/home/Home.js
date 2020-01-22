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


  const [view, setView] = useState(null);

  // Dialog Information
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState('building');
  const [dialogTitle, setDialogTitle] = useState('default');
  const [dialogTitleSubscript, setDialogTitleSubscript] = useState('default');

  // Sub entities, this needs to be changed to sub 
  const [buildingEntities, setBuildingEntities] = useState([]);

  // Selected building, floor, and room info, also needs to be changed
  const [building, setBuilding] = useState(null);
  const [floorNumber, setFloorNumber] = useState(null);
  const [room, setRoom] = useState(null);

  useEffect(() => {
    console.log('HOME WAS RENDERED');

    console.log(building);
  }, []);

  /**
   * 
   */
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

  useEffect(() => {
    // Our app entity
    console.log(props.appEntity.appType);
    if (props.appEntity.appType === 'GeoSubGeo') {
      // Here we don't auto select anything and show a global view
      setView(props.appEntity.appType);
    }
  }, [props.appEntity]);

  useEffect(() => {
    getBuildingEntities();
  }, []);


  // TODO: This shouldn't get buildings specifically, it should grab the next level down in the heirarchy
  function getBuildingEntities() {
    // axios.get(http://128.195.53.189:4001/api/entity/search?orderBy=id&direction=ASC&orderBy2=id&direction2=ASC&limit=25&entityTypeName=building)
    setBuildingEntities({
      "resultCode": 100,
      "message": "Entities found with search parameters.",
      "entities": [
        {
          "id": 3,
          "name": "DBH",
          "entityType": {
              "subtypeOf": 2,
              "entityTypeName": "building",
              "entityTypeId": 5
          },
          "payload": {
              "geoId": 3
          }
        }
      ]}.entities);
  }

  // Select building is run when we select a geolocation block 
  function selectBuilding(building) {
    // setBuilding(null);
    console.log(building);
    setBuilding(building);
    if (view === 'GeoSubGeo') {
      // props.setCurrentRoute([...props.currentRoute, {
      //   id: building.buildingId,
      //   name: building.name
      // }]);
      props.history.push('/' + props.routes[0] + '/' + props.routes[1] + '/' + building.buildingId);
    }
  }

  // Sets the building to be null and changes the route
  function resetBuilding() {
    setBuilding(null);
    props.history.push('/geolocation');
  }

  // Resets the building to the building that we selected (this maintains the selected building and deselects a room)
  function resetSelectedBuilding() {
    if (building !== undefined && building !== null) {
      props.history.push('/geolocation/' + building.buildingId);
    } else {
      alert('Null building url');
    }
  }

  // Opens a floor 
  function openFloor(floorNumber) {
    setFloorNumber(floorNumber);
    props.history.push('/geolocation/' + building.buildingId + '/floor/' + floorNumber);
  }

  // Select room is run when we select a room from the floor map
  function selectRoom(room) {
    setRoom(room);

    // If the sub-level isn't defined, we shouldn't be able to select a room
    if (building !== undefined && building !== null) {
      props.history.push('/geolocation/' + building.buildingId + '/floor/' + floorNumber + '/room/' + room.name);
    } else {
      alert('Building is null');
    }
  }

  // Opens a dialog using the information given
  function openDialog(buildingType, title, titleSubscript) {
    setDialogType(buildingType);
    setDialogTitle(title);
    setDialogTitleSubscript(titleSubscript);
    setShowDialog(true);
  }

  // Renders the coordinate map on the page if we need to select a geo object (GeoSubGeo, GeoSubNonGeo)
  function conditionalMap() {
    return (<CoordinateMap selectBuilding={selectBuilding} appEntity={props.appEntity} buildingEntities={buildingEntities}></CoordinateMap>);
  }

  // Renders the floor map if we need to select a non-geo object (GeoSubNonGeo, NonGeoSubNonGeo)
  function conditionalFloorMap() {
    return (<FloorMap selectRoom={selectRoom}></FloorMap>);
  }

  // Renders teh dialog 
  function renderDialogView(type) {
    let entityId = null;
    if (type === 'building' && building !== null) {
      entityId = building.buildingId;
    }
    return <OccupancyDialog type={type} entity={entityId}/>
  }

  // Renders a title based on the type of app we currently have loading
  function renderTitle() {
    // Renders GeoSubGeo
    // This renders the main app entity name and then the building (sub-entity that we have selected)
    if (view === 'GeoSubGeo') {
      return (
        <React.Fragment>
          <h1 onClick={() => resetBuilding()}>
            {props.appEntity.name}
          </h1>
          { building !== null ?
            <p>
              &nbsp;&nbsp;>&nbsp;&nbsp;
              <span style={building.name.length > 15 ? {'fontSize': '20px'} : null}>
                {building.name}
              </span>  
            </p>
            : null
          }
        </React.Fragment>
      );
    
    // Renders GeoSubNonGeo
    // This renders a title where we have a pre-selected building (there is no parent entity like campus -> building)
    } else if (view === 'GeoSubNonGeo') {
      return (
        <React.Fragment>
          <h1>
            {props.appEntity.name}
          </h1>
        </React.Fragment>
      );
      
    // Renders NonGeoSubNonGeo
    // This renders a title where we have a floor pre-selected, and the rooms are the available spaces we can search
    } else if (view === 'NonGeoSubNonGeo') {
      return (
        <React.Fragment>
          <h1 onClick={() => resetSelectedBuilding()}>
            { building !== null ? building.name : 'Default'}
          </h1>
          <p>&nbsp;&nbsp;>&nbsp;&nbsp;Floor {floorNumber}</p>    
        </React.Fragment>
      );
    }
  }

  // Renders the side panel that we can view the information for
  function renderView() {
    console.log(view, building);
    // If we are in a geosubgeo app type 
    // We can render the global view of the campus, and the building information 
    if (view === 'GeoSubGeo') {
      return (
        <React.Fragment>
          { building !== null ?
            // We aren't always showing the global view, only show it if we have a global entity like campus->building
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
    // Render just the building information because we will have no global entity to show information for 
    } else if (view === 'GeoSubNonGeo') {
      return (
        <React.Fragment>
          { building !== null ?
            <BuildingInformation 
              building={building}
              openFloor={openFloor}
              history={props.history}
              openDialog={openDialog}
            /> 
            : null
          }
        </React.Fragment>
      );
    }
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
          {renderTitle()}
          {/* <Route exact path="/geolocation/:buildingId?" component={conditionalGeolocationTitle}></Route>
          <Route exact path="/geolocation/:buildingId/floor/:floorId/(room)?/:roomId?" component={conditionalFloorTitle}></Route> */}
        </div>
        <div className="information-tab-content">
          {renderView()}
          {/* <Route exact path="/geolocation/:buildingId?" component={conditionalGeolocationInformation}></Route>
          <Route exact path="/geolocation/:buildingId/floor/:floorId/(room)?/:roomId?" component={conditionalFloorInformation}></Route> */}
        </div>
      </Card>
    </div>
  );
}

export default Home;
