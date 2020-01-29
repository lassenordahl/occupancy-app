import React from "react";
import './Nav.scss';

import { Breadcrumbs, Breadcrumb } from 'react-rainbow-components';
import { useLocation } from 'react-router-dom';
import { capitalizeWords, serializeLocation } from 'globals/formatting-helper.js';

function Nav(props) {

  let currentRoute = serializeLocation(useLocation());

  console.log(currentRoute);

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
        <Breadcrumbs class="nav-breadcrumbs" style={{'marginLeft': '16px'}}>
          {currentRoute.map(function(entity, index) {
            if (index % 2 === 1) {
              return (
                <Breadcrumb key={index} label={capitalizeWords(entity)} onClick={() => changeRoute(index)}></Breadcrumb>
              )
            } else {
              return null;
            }
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
