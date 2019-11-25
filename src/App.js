import React, { useState, useEffect } from 'react';
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';
import history from './history';
import './App.scss';
import ApplicationContext from 'globals/contexts/ApplicationContext';

import app_config from 'globals/config.js';
import { Spinner } from 'react-rainbow-components';

import {
  Nav
} from 'app/components';

import {
  Home,
  InvalidRoute
} from 'app/views';

function App() {

  const [appEntity, setAppEntity] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // pass the building id's too 
    getApplicationEntity(app_config.id);

    setTimeout(() => {
      setLoading(false);
    }, 1000)
  }, []);

  function getApplicationEntity(entityId) {
    setAppEntity({
      "resultCode": 100,
      "message": "Entities found with search parameters.",
      "entity": {
        "id": 2,
        "name": "UC Irvine",
        "typeId": 4,
        "typeName": "university"
      }
    }.entity);
  
   
    // axios.get('http://128.195.53.189:4001/api/entity/get/' + entityId, {
    //   headers: {
    //     'Access-Control-Allow-Origin': '*',
    //   }
    // })
    //   .then(function (response) {
    //     console.log(response);
    //   })
    //   .catch(function (error) {
    //     console.log('APP ENTITY GET', error);
    //   });
  }



  return (
    <div className='App'>
      { loading || appEntity === null ? 
        <Spinner size="large"/>
        :
        <ApplicationContext.Provider value={appEntity}>
          <Router history={history}>
            <Nav title={appEntity.name}></Nav>
            <div className="app-content">
                <Switch>
                  <Route path='/geolocation/:buildingId?/(floor)?/:floorId?' component={(props) => <Home {...props} appEntity={appEntity}></Home>}/>
                  <Route exact path="/">
                    <Redirect to="/geolocation"></Redirect>
                  </Route>
                  <Route component={InvalidRoute}></Route>
                </Switch>
            </div>
          </Router>
        </ApplicationContext.Provider>
      }
      
    </div>
  );
}

export default App;
