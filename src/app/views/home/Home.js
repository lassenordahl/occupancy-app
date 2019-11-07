import React, { useState, useEffect } from "react";
import './Home.scss';

import 'leaflet/dist/leaflet.css';
import { Route } from 'react-router-dom';
import { Trail } from 'react-spring/renderprops';

import {
  Card,
  Dialog
} from 'app/containers';

import {
  Legend,
  CoordinateMap,
} from 'app/components';

import { 
  BuildingInformation,
  GlobalInformation
} from 'app/views';


function Home(props) {
  const [showDialog, setShowDialog] = useState(false);
  const [building, setBuilding] = useState(null);
  const [floorNumber, setFloorNumber] = useState(null);

  const items = [
    1,2,3,4,5,6
  ]

  useEffect(() => {
    let urlBuildingId = props.match.params.buildingId;
    let floorId = props.match.params.floorId;
    // alert(props.match.params.buildingId);
    // alert(props.match.params.floorId);
    if (floorId === undefined) {
      setFloorNumber(null);
    } else {
      setFloorNumber(floorId);
    }
    // if url building id is not in the valid id's then we can just set it to be nothing
  });

  function selectBuilding(building) {
    setBuilding(null);
    setBuilding(building);
    props.history.push('/geolocation/' + building.buildingId);
  }

  function resetBuilding() {
    setBuilding(null);
    props.history.push('/geolocation');
  }

  function openFloor(floorNumber) {
    setFloorNumber(floorNumber);
    props.history.push('/geolocation/' + building.buildingId + '/floor/' + floorNumber);
  }

  function conditionalGeolocation() {
    return (
      <React.Fragment>
        { building !== null ?
          <BuildingInformation 
            building={building}
            openFloor={openFloor}
            history={props.history}
          /> 
          :
          <GlobalInformation/>
        }
      </React.Fragment>
    );
  }

  function conditionalFloor() {
    return (
      <div>
        <h2>
          Floor Information
        </h2>
        <p>
          You have selected a floor
        </p>
      </div>
    );
  }

  function conditionalMap() {
    return (<CoordinateMap selectBuilding={selectBuilding}></CoordinateMap>);
  }

  function conditionalFloorMap() {
    return (
      <div>
        This will be the floor map
      </div>
    );
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
        <h1>
          { building !== null ? building.name : 'Default'}
        </h1>
        <p>&nbsp;&nbsp;>&nbsp;&nbsp;Floor {floorNumber}</p>    
      </React.Fragment>
    );
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
          title="Hello!"
        >
            <div className="dialog-test-content">
              <Trail 
                items={items} 
                keys={item => item} 
                from={{opacity: 0}} 
                to={{opacity: 1}}
                duration={4000}
              >
                {item => props => 
                  <Card className="flex-center test" style={props}>
                    <h1>
                      {item}    
                    </h1>
                  </Card>
                }
              </Trail>
            </div>
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
          <Route exact path="/geolocation/:buildingId/floor/:floorId" component={conditionalFloorTitle}></Route>
        </div>
        <div className="information-tab-content">
          <Route exact path="/geolocation/:buildingId?" component={conditionalGeolocation}></Route>
          <Route exact path="/geolocation/:buildingId/floor/:floorId" component={conditionalFloor}></Route>
        </div>
      </Card>
    </div>
  );
}

export default Home;
