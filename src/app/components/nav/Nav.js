import React, { useState, useEffect, useCallback } from "react";
import "./Nav.scss";

import { Breadcrumbs, Breadcrumb, Button } from "react-rainbow-components";
import { useLocation, withRouter, Redirect } from "react-router-dom";
import {
  capitalizeWords,
  serializeLocation,
  serializeLocationString
} from "globals/utils/formatting-helper.js";
import axios from "axios";
import authGet from "../../../globals/authentication/AuthGet";
import api from "globals/api";

function Nav(props) {
  let currentRoute = serializeLocation(useLocation());
  let entityIds = filterEntityIds(currentRoute);

  const [entityNames, setEntityNames] = useState([]);
  const [filteredRoute, setFilteredRoute] = useState([]);

  // Redirecting variables
  const [willRedirect, redirect] = useState(false);

  const [, updateState] = React.useState();
  const forceUpdate = useCallback(() => updateState({}), []);

  useEffect(() => {
    props.history.listen(function(location, action) {
      forceUpdate();
      getEntityNames(filterEntityIds(serializeLocation(location)));
    });
    // props.history.listen(() => getEntityNames(entityIds));
  }, []);

  useEffect(() => {
    if (willRedirect) {
      redirect(false);
    }
  }, [willRedirect]);

  useEffect(() => {
    redirect(true);
  }, [filteredRoute]);

  function getRedirect() {
    let route = "/" + filteredRoute.join("/");
    return <Redirect from="/" to={route}></Redirect>;
  }

  async function getEntityNames(entityIds) {
    let entityResults = await Promise.all(
      entityIds.map(function(entityId) {
        return authGet(api.entity + "/" + entityId);
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
      return index % 2 === 0;
    });
  }

  // Removes everything after this index, lets you click back with the breadcrumbs
  function changeRoute(index) {
    console.log(currentRoute);
    setFilteredRoute(currentRoute.filter(function(routeItem, rIndex) {
      console.log(routeItem);
      console.log(rIndex, index);
      return rIndex + 1 < index;
    }));
  }

  function redirectLogout() {
    window.location.href = '/logout'
  }

  function showLoginButton() {
    if (props.auth.authStatus) {
      return (<Button label="Logout" style={{marginLeft: "1rem"}} onClick={() => redirectLogout()}></Button>)
    }
  }

  return (
    <div className="Nav flex-split box-shadow">

      {willRedirect ? getRedirect() : null}

      <div className="flex-start-row">
        <h2>Occupancy Tool</h2>
        <Breadcrumbs class="nav-breadcrumbs" style={{ marginLeft: "16px" }}>
          {entityNames.map(function(entityName, index) {
            return (
              <Breadcrumb
                key={index}
                onClick={() => changeRoute((index + 1) * 2)}
                label={capitalizeWords(entityName)}
              ></Breadcrumb>
            );
          })}
        </Breadcrumbs>
      </div>
      <h3>
        <a href="http://tippersweb.ics.uci.edu/">Tippers Info</a>
        { showLoginButton() }
      </h3>
    </div>
  );
}

export default withRouter(Nav);
