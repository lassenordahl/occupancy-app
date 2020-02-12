import React, { useState, useEffect } from "react";
import history from "./history";
import "./App.scss";
import ApplicationContext from "globals/contexts/ApplicationContext";
import RouteContext from "globals/contexts/RouteContext";

import app_config from "globals/config.js";
import { Spinner } from "react-rainbow-components";
import {
  Route,
  Switch,
  BrowserRouter as Router,
  Redirect,
  useLocation
} from "react-router-dom";
import axios from "axios";
// import { seralizeLocation } from 'globals/formatting-helper';

import { Nav } from "app/components";

import { Home, InvalidRoute } from "app/views";

import { serializeLocation } from "globals/utils/formatting-helper";

/*
  3 TYPES OF ROOTS
  
  1. Root GEO with GEO sub-children
      -> University with buildings
  2. Root GEO with NON-GEO sub-children
      -> Building with floors
  3. Root NON-GEO with NON-GEO sub-children
      -> Floor with rooms

  Root Type Variable Names
  
  1. GeoSubGeo
  2. GeoSubNonGeo
  3. NonGeoSubNonGeo
  4. NoChildren

*/

function App() {
  const [firstLoad, setFirstLoad] = useState(true);

  const [routes, setRoutes] = useState([]);
  const [appRoute, setAppRoute] = useState([]);

  // Our main entity for the application
  const [rootEntity, setRootEntity] = useState(null);

  // App entity for the application and the app type
  const [appEntity, setAppEntity] = useState(null);
  const [appType, setAppType] = useState(null);

  const [loading, setLoading] = useState(true);

  // console.log(serializeLocation(useLocation()));


  // Retrieves the root entity information and subsequently checks the root type later down the path
  useEffect(() => {
    // Get the routes for the application
    getRoutes();

    setTimeout(() => {
      setLoading(false);
    }, 1000);
  }, [app_config.id]);

  useEffect(() => {
    if (routes.length > 0) {
      getRootEntity(app_config.id);
    }
  }, [routes]);

  useEffect(() => {
    if (firstLoad) {
      setFirstLoad(false);
    }
  }, [firstLoad]);

  // UseEffect for setting the app entity to contain root information and the application type that
  // this app should render to
  useEffect(() => {
    if (rootEntity !== null && appType !== null) {
      // Create an app entity that also contains the type of root this application is using
      rootEntity["appType"] = appType;
      console.log(rootEntity);
      setAppEntity(rootEntity);
    }
  }, [rootEntity, appType]);

  function getRoutes() {
    setRoutes(["university", "building", "floor", "room"]);
  }

  function getRootEntity(entityId) {
    axios
      .get("http://128.195.53.189:4001/api/entity/" + entityId)
      .then(function(response) {
        let entity = response.data;
        // Sets the app entity
        setRootEntity(entity);

        // Gets the possible routes for the application
        setAppRoute([routes[0], entityId]);

        // Makes a call to get the geo object of the root entity geo id
        getAppType(entity.payload);
      })
      .catch(function(error) {
        console.log("APP ENTITY GET", error);
      });
  }

  // GEOLOCATION ENTITY
  // Make a request for the entity id one type lower than the root type
  function getAppType(payload) {
    let coordinateSystem =
      payload.geo.coordinateSystem.coordinateSystemClassName;
    console.log(coordinateSystem);
    // Set the app type based on the entity type of the geolocation system
    if (coordinateSystem === "gps") {
      setAppType("GeoSubGeo");
    } else if (coordinateSystem === "cartesian2hfd") {
      setAppType("GeoSubNonGeo");
    } else if (coordinateSystem === "cartesian2d") {
      setAppType("NonGeoSubNonGeo");
    } else {
      setAppType("Invalid");
    }
  }

  return (
    <div className="App">
      {/* {firstLoad ? <Redirect to="/"></Redirect>: null } */}
      {loading || appEntity == null ? (
        // {loading || appEntity == null ? (
        <Spinner size="large" />
      ) : (
        <ApplicationContext.Provider value={appEntity}>
          <RouteContext.Provider
            value={{
              appRoute: appRoute,
              setAppRoute: setAppRoute
            }}
          >
            <Router history={history}>
              {/* <Nav title={appEntity.name} routes={routes}></Nav> */}
              <div className="app-content">
                <Switch>
                  <Route
                    path={"/"}
                    component={props => (
                      <Home
                        {...props}
                        appEntity={appEntity}
                        routes={routes}
                        appRoute={appRoute}
                        setAppRoute={setAppRoute}
                        appType={appType}
                      ></Home>
                    )}
                  />
                  {/* <Route exact path='/'>
                    <Redirect to={'/' + routes[0]}></Redirect>
                  </Route> */}
                  <Route component={InvalidRoute}></Route>
                </Switch>
              </div>
            </Router>
          </RouteContext.Provider>
        </ApplicationContext.Provider>
      )}
    </div>
  );
}

export default App;
