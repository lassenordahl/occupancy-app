import React, { useState, useEffect} from "react";
import './Nav.scss';

import { Breadcrumbs, Breadcrumb } from 'react-rainbow-components';
import { Route, Redirect } from 'react-router-dom';
import { tsPropertySignature } from "@babel/types";

import { capitalizeWords } from 'globals/formatting-helper.js';


function Nav(props) {

  // const [redirectCampus, setRedirectCampus] = useState(false);
  // const [redirectBuilding, setRedirectBuilding] = useState(false);
  // const [redirectFloor, setRedirectFloor] = useState(false);

  // Removes everything after this index, lets you click back with the breadcrumbs
  function changeRoute(index) {
    props.setCurrentRoute(props.currentRoute.filter(function(route, routeIndex) {
      return routeIndex <= index;
    }));
  }

  return (
    <div className="Nav flex-split box-shadow">
      <div className="flex-start-row">
        <h2>
          Occupancy Tool
        </h2>
        <Breadcrumbs style={{'marginLeft': '16px'}}>
          {/* <Breadcrumb label="Campus Map" onClick={() => setRedirectCampus(true)}/>
          <Route path="/geolocation/:buildingId" component={conditionalBuilding}></Route>
          <Route path="/geolocation/:buildingId/floor/:floorId" component={conditionalFloor}></Route>
          <Route path="/geolocation/:buildingId/floor/:floorId/room/:roomId" component={conditionalRoom}></Route> */}
          {props.currentRoute.map(function(route, index) {
            return (
              <Breadcrumb label={capitalizeWords(route.name)} onClick={() => changeRoute(index)}></Breadcrumb>
            )
          })}
        </Breadcrumbs>
      </div>
      <h3>
        <a href="http://tippersweb.ics.uci.edu/">
          Tippers Info
        </a>
      </h3>
    </div>
  );
}

export default Nav;
