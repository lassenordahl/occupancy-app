import React, {useState} from "react";
import './Nav.scss';

import { Breadcrumbs, Breadcrumb } from 'react-rainbow-components';
import { Route, Redirect } from 'react-router-dom';
import { tsPropertySignature } from "@babel/types";

function Nav(props) {

  const [redirectCampus, setRedirectCampus] = useState(false);
  const [redirectBuilding, setRedirectBuilding] = useState(false);

  function conditionalBuilding() {
    return (<Breadcrumb label="Building" onClick={() => setRedirectBuilding(true)}/>);
  }

  function conditionalFloor() {
    return (<Breadcrumb label="Floor"/>);
  }

  console.log(props.match);

  return (
    <div className="Nav flex-split box-shadow">
      <div className="flex-start-row">
        <h2>
          UCI Occupancy Tool
        </h2>
        <Breadcrumbs style={{'margin-left': '16px'}}>
          <Breadcrumb label="Campus Map" onClick={() => setRedirectCampus(true)}/>
          <Route path="/geolocation/:buildingId" component={conditionalBuilding}></Route>
          <Route path="/geolocation/:buildingId/floor/:floorId" component={conditionalFloor}></Route>
        </Breadcrumbs>
      </div>
      { redirectCampus ? <Redirect to="/geolocation"></Redirect> : null}
      { redirectBuilding ? <Redirect to="/geolocation"></Redirect> : null}
      <h3>
        <a href="http://tippersweb.ics.uci.edu/">
          Tippers Info
        </a>
      </h3>
    </div>
  );
}

export default Nav;
