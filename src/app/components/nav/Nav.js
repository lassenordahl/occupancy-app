import React, { useState, useEffect } from "react";
import "./Nav.scss";

import { Breadcrumbs, Breadcrumb } from "react-rainbow-components";
import { useLocation, withRouter } from "react-router-dom";
import {
  capitalizeWords,
  serializeLocation
} from "globals/utils/formatting-helper.js";
import axios from "axios";

function Nav(props) {
  let currentRoute = serializeLocation(useLocation());
  let entityIds = filterEntityIds(currentRoute);

  const [entityNames, setEntityNames] = useState([]);

  console.log(props.history);

  useEffect(() => {
    props.history.listen(() => getEntityNames(entityIds));
  }, []);

  async function getEntityNames(entityIds) {
    let entityResults = await Promise.all(
      entityIds.map(function(entityId) {
        return axios.get("http://128.195.53.189:4001/api/entity/" + entityId);
      })
    );
    setEntityNames(
      entityResults.map(function(result) {
        if (result.data !== undefined) {
          return result.data.name;
        } else {
          return "Invalid URL Param";
        }
      })
    );
  }

  function filterEntityIds(routeArray) {
    return routeArray.filter(function(routeElement, index) {
      return index % 2 === 1;
    });
  }

  // Removes everything after this index, lets you click back with the breadcrumbs
  function changeRoute(index) {
    props.setCurrentRoute(
      props.currentRoute.filter(function(route, routeIndex) {
        return routeIndex <= index;
      })
    );
  }

  return (
    <div className="Nav flex-split box-shadow">
      <div className="flex-start-row">
        <h2>Occupancy Tool</h2>
        <Breadcrumbs class="nav-breadcrumbs" style={{ marginLeft: "16px" }}>
          {entityNames.map(function(entityName, index) {
            return (
              <Breadcrumb
                key={index}
                label={capitalizeWords(entityName)}
              ></Breadcrumb>
            );
          })}
        </Breadcrumbs>
      </div>
      <h3>
        <a href="http://tippersweb.ics.uci.edu/">Tippers Info</a>
      </h3>
    </div>
  );
}

export default withRouter(Nav);
