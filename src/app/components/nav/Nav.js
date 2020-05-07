import React, { useState, useEffect, useCallback } from "react";
import "./Nav.scss";

import { Breadcrumbs, Breadcrumb } from "react-rainbow-components";
import { useLocation, withRouter, Redirect, Link } from "react-router-dom";

import config from "globals/config";
import {
  capitalizeWords,
  serializeLocation,
  getQueryString
} from "globals/utils/formatting-helper.js";
import authGet from "../../../globals/authentication/AuthGet";
import api from "globals/api";
import { OccupancyButton } from "app/components";
import { useQueryParams } from "globals/hooks";
import tippersLogo from "assets/images/tippers-logo.png";
import occupancyLogo from "assets/images/occupancy-logo.png";

function Nav(props) {
  let currentRoute = serializeLocation(useLocation());
  let queryParams = useQueryParams();

  const [entityNames, setEntityNames] = useState([]);
  const [filteredRoute, setFilteredRoute] = useState([]);

  // Redirecting variables
  const [willRedirect, redirect] = useState(false);

  useEffect(() => {
    props.history.listen(function(location, action) {
      // If we don't have an empty URL
      let entityIds = filterEntityIds(serializeLocation(location));
      if (entityIds[0] !== "") {
        getEntityNames(entityIds);
      }
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
    return <Redirect from="/" to={route + "?" + getQueryString(queryParams)}></Redirect>;
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
    setFilteredRoute(
      currentRoute.filter(function(routeItem, rIndex) {
        return rIndex <= index;
      })
    );
  }

  function redirectLogout() {
    window.location.href = `${process.env.PUBLIC_URL}/logout`;
  }

  function showLoginButton() {
    if (props.auth.authStatus) {
      return (
        <OccupancyButton
          label="Logout"
          style={{ marginLeft: "1rem" }}
          onClick={() => redirectLogout()}
        >
        </OccupancyButton>
      );
    }
  }

  return (
    <div className="Nav flex-split box-shadow">
      {willRedirect ? getRedirect() : null}

      <div className="flex-start-row">
        <img className="app-logo" src={occupancyLogo} alt="logo"></img>
        <Link to={"/" + config.id + "?" + getQueryString(queryParams)}>
          <h2>Occupancy Tool</h2>
        </Link>
        <Breadcrumbs className="nav-breadcrumbs" style={{ marginLeft: "16px" }}>
          {entityNames.map(function(entityName, index) {
            return (
              <Breadcrumb
                key={index}
                onClick={() => changeRoute((index) * 2)}
                label={capitalizeWords(entityName)}
              ></Breadcrumb>
            );
          })}
        </Breadcrumbs>
      </div>
      <div className="nav-buttons">
        <a href="http://hub-tippers.ics.uci.edu">
          <div className="circular-button box-shadow">
            <img src={tippersLogo} alt="button-logo"></img>
            <p>Hub</p>
          </div>
        </a>

        {showLoginButton()}
      </div>
    </div>
  );
}

export default withRouter(Nav);
