import React from 'react';
import { Route, Switch, BrowserRouter as Router } from 'react-router-dom';
import history from './history';
import './App.scss';

import {
  Nav
} from 'app/components';

import {
  Home
} from 'app/views';

function App() {
  return (
    <div className='App'>
      <Nav></Nav>
      <div className="app-content">
        <Router history={history}>
          <Switch>
            <Route exact path='/' component={Home}/>
          </Switch>
        </Router>
      </div>
    </div>
  );
}

export default App;
