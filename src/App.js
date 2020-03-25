import React, { useState, useEffect } from "react";
import history from "./history";
import "./App.scss";

import { Route, Switch, BrowserRouter as Router } from "react-router-dom";

import { Nav } from "app/components";

import { Home, InvalidRoute, PrivateRoute, DefaultView } from "app/views";

import { Application } from "react-rainbow-components";

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

var applicationTheme = {
  rainbow: {
    palette: {
      brand: "#2749c4"
    }
  }
};

function App() {
  const [authStatus, setAuthStatus] = useState(false);

  return (
    <div className="App">
      <Application theme={applicationTheme}>
        <Router history={history}>
          <Nav auth={{ authStatus: authStatus }}></Nav>
          <div className="app-content">
            {/* <DefaultView></DefaultView> */}
            <Switch>
              <Route path={"/home"} component={DefaultView} />
              <Route
                path={"/"}
                auth={{ authStatus: authStatus, setAuthStatus: setAuthStatus }}
                component={props => <Home {...props} appRoute={[]}></Home>}
              />
              <Route component={InvalidRoute}></Route>
            </Switch>
          </div>
        </Router>
      </Application>
    </div>
  );
}

export default App;
