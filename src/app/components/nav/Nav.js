import React from "react";
import './Nav.scss';

import { Breadcrumbs, Breadcrumb } from 'react-rainbow-components';

function Nav() {
  return (
    <div className="Nav flex-split box-shadow">
      <div className="flex-start-row">
        <h2>
          UCI Occupancy Tool
        </h2>
        <Breadcrumbs style={{'margin-left': '16px'}}>
          <Breadcrumb label="Campus Map"/>
          <Breadcrumb label="Floor Map"/>
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
