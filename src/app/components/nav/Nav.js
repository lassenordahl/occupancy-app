import React from "react";
import './Nav.scss';

import { Breadcrumbs, Breadcrumb } from 'react-rainbow-components';
import { useRouteMatch } from 'react-router-dom';
import { capitalizeWords } from 'globals/formatting-helper.js';

function Nav(props) {

  let { path, url } = useRouteMatch();
  console.log(path, url);

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
          {props.currentRoute.map(function(route, index) {
            return (
              <Breadcrumb key={index} label={capitalizeWords(route.name)} onClick={() => changeRoute(index)}></Breadcrumb>
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
