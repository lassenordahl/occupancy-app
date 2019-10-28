import React from 'react';
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';
import history from './history';
import './App.scss';

import {
  Nav
} from 'app/components';

import {
  Home,
  InvalidRoute
} from 'app/views';

function App() {
  return (
    <div className='App'>
      <Router history={history}>
        <Nav></Nav>
        <div className="app-content">
            <Switch>
              <Route path='/geolocation/:buildingId?/(floor)?/:floorId?' component={Home}/>
              <Route exact path="/">
                <Redirect to="/geolocation"></Redirect>
              </Route>
              <Route component={InvalidRoute}></Route>
            </Switch>
        </div>
      </Router>
    </div>
  );
}

export default App;
