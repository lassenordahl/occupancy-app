import React from "react";
import './Nav.scss';

import { Breadcrumbs, Breadcrumb } from 'react-rainbow-components';
import { Route } from 'react-router-dom';

function ConditionalBreadcrumb() {
  return (
    <Breadcrumb label="Floor Map"/>
  );
}

function Nav() {

  return (
    <div className="Nav flex-split box-shadow">
      <div className="flex-start-row">
        <h2>
          UCI Occupancy Tool
        </h2>
        <Breadcrumbs style={{'margin-left': '16px'}}>
          <Breadcrumb label="Campus Map"/>
          <Route path="/geolocation/:buildingId/floor/:floorId" component={ConditionalBreadcrumb}></Route>
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
