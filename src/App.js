import React, { useState, useEffect } from "react";
import history from "./history";
import "./App.scss";
import ApplicationContext from "globals/contexts/ApplicationContext";
import RouteContext from "globals/contexts/RouteContext";
import authGet from "globals/authentication/AuthGet";
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

import { Home, InvalidRoute, PrivateRoute, DefaultView } from "app/views";

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

  const [authStatus, setAuthStatus] = useState(false);

  return (
    <div className="App">
      <Router history={history}>
        <Nav auth={{authStatus: authStatus}}></Nav>
        <div className="app-content">
          {/* <DefaultView></DefaultView> */}
          <Switch>
            <Route
              path={"/home"}
              component={DefaultView}
            />
            <Route
              path={"/"}
              onChange={() => console.log('changed route')}
              auth={{authStatus: authStatus, setAuthStatus: setAuthStatus}}
              component={props => (
                <Home
                  {...props}
                  appRoute={[]}
                ></Home>
              )}
            />
            <Route component={InvalidRoute}></Route>
          </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
