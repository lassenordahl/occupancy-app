import React, { useState, useEffect } from 'react';
import history from './history';
import './App.scss';
import ApplicationContext from 'globals/contexts/ApplicationContext';
import RouteContext from 'globals/contexts/RouteContext';

import app_config from 'globals/config.js';
import { Spinner } from 'react-rainbow-components';
import { Route, Switch, BrowserRouter as Router, Redirect } from 'react-router-dom';
import axios from 'axios';

import {
  Nav
} from 'app/components';

import {
  Home,
  InvalidRoute
} from 'app/views';

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

  const [routes, setRoutes] = useState([]);
  const [currentRoute, setCurrentRoute] = useState([]); 

  // Our main entity for the application
  const [rootEntity, setRootEntity] = useState(null);

  // Geolocation types for the root and subsequent child
  const [rootType, setRootType] = useState(null);
  const [subRootType, setSubRootType] = useState(null);

  // App entity for the application and the app type
  const [appEntity, setAppEntity] = useState(null);
  const [appType, setAppType] = useState(null);
  
  const [loading, setLoading] = useState(true);

  // Retrieves the root entity information and subsequently checks the root type later down the path
  useEffect(() => {
    // pass the building id's too 
    getRootEntity(app_config.id);
    // Get the routes for the application
    getRoutes();

    setTimeout(() => {
      setLoading(false);
    }, 1000)
  }, [app_config.id]);


  // UseEffect for setting the app entity to contain root information and the application type that
  // this app should render to 
  useEffect(() => {
    if (rootEntity !== null && appType !== null) {
      // Create an app entity that also contains the type of root this application is using
      rootEntity['appType'] = appType;
      console.log(rootEntity);
      setAppEntity(rootEntity);
    }
  }, [rootEntity, appType]);

  // UseEffect figures out the app type after we have both the rootTypeo and subrootType 
  useEffect(() => {
    if (rootType !== null && subRootType !== null) {
      mapAppType();
    }
  }, [rootType, subRootType])

  
  function getRoutes() {
    setRoutes(['university', 'building', 'floor', 'meeting room']);
  }

  function mapAppType() {
    if (rootType === "Invalid") {
      setAppType("Invalid");  
    } else if (subRootType === "Invalid") {
      setAppType("No children");
    } else {
      setAppType(rootType + "Sub" + subRootType);
    }
  }

  function getRootEntity(entityId) {  
    axios.get('http://128.195.53.189:4001/api/entity/get/' + entityId)
      .then(function (response) {
        let entity = response.data.entity;
        console.log(entity);
        getSubRootType(entity.entityType.entityTypeId + 1);
        setRootEntity(entity);
        setCurrentRoute([...currentRoute, {
          id: entity.id,
          name: entity.name
        }]);
        setGeolocationType(entity.id, setRootType);
      })
      .catch(function (error) {
        console.log('APP ENTITY GET', error);
      });

    // TODO
    // This is a logic error, the subtype of this ID might not always be 1 less than
    // The type id of the given root entity
  }

  function getSubRootType(entityId) {
    // Make a request for the entity id one type lower than the root type 
     axios.get('http://128.195.53.189:4001/api/entity/search', {
        params: {
          entityTypeId: entityId  
        }
    })
      .then(function (response) {
        console.log('SUBROOT', response);
      })
      .catch(function (error) {
        console.log('APP ENTITY GET', error);
      });

      //TODO - This is the current way to find the types
    let responseEntities = {
      "resultCode": 100,
      "message": "Entities found with search parameters.",
      "entities": [
        {
          "id": 3,
          "name": "DBH",
          "entityType": {
              "subtypeOf": 2,
              "entityTypeName": "building",
              "entityTypeId": 5
          },
          "payload": {
              "geoId": 3
          }
        }
      ]
    }.entities;

    if (responseEntities.length > 0) {
      setGeolocationType(responseEntities[0].id, setSubRootType);
    } else {
      alert('unable to pull the children for this app');
      setRootType(
        'Invalid'
      );
    }
  }

  function setGeolocationType(geoId, setFunction) {
    // GEOLOCATION ENTITY
  // Make a request for the entity id one type lower than the root type 
     // axios.get('http://128.195.53.189:4001/api/geo/get/' + entityId, {
    //   params: {
      //    entityTypeId: entityid  
    // }
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

    let response = {
      "resultCode": 191,
      "message": "Found space geo object",
      "geo": {
        "extent": {
          "extentClassId": 3,
          "start": {
            "latitude": 33.642992,
            "longitude": -117.8422864
          },
          "extentClassName": "rectangle",
          "end": {
            "latitude": 33.6435452,
            "longitude": -117.8414719
          }
        },
        "parentSpaceId": 2,
        "coordinateSystem": {
          "coordinateSystemClassName": "coordinateSystem2hfd",
          "range": {
            "yMin": 0,
            "yMax": 1000,
            "floorMin": 1,
            "xMax": 1000,
            "floorMax": 6,
            "xMin": 0
          },
          "coordinateSystemClassId": 3
        }
      }
    };

    let className = response.geo.coordinateSystem.coordinateSystemClassName;

    if (className === 'coordinateSystem2d') {
      setFunction('NonGeo');
      // coordinateSystem2hfd has a parent that has a special attribute (2.5 D) 
    } else if (className === 'coordinateSystem2hfd' || className === 'coordinateSystemGps') {
      setFunction('Geo');
    } else {
      setFunction('Invalid');
    }
  }

  return (
    <div className='App'>
      { loading || appEntity == null ? 
        <Spinner size="large"/>
        :
        <ApplicationContext.Provider 
          value={appEntity}
        >
        <RouteContext.Provider 
          value={{
            currentRoute: currentRoute, 
            setCurrentRoute: setCurrentRoute
          }}
        >
          <Router history={history}>
            <Nav 
              title={appEntity.name}
              routes={routes}
              currentRoute={currentRoute}
              setCurrentRoute={setCurrentRoute}
            ></Nav>
            <div className="app-content">
                <Switch>
                  <Route 
                    path={'/' + routes[0]}
                    component={(props) => <Home {...props} appEntity={appEntity} routes={routes} currentRoute={currentRoute} setCurrentRoute={setCurrentRoute}></Home>}
                  />
                  <Route exact path='/'>
                    <Redirect to={'/' + routes[0]}></Redirect>
                  </Route>
                  <Route component={InvalidRoute}></Route>
                </Switch>
            </div>
          </Router>
        </RouteContext.Provider>
        </ApplicationContext.Provider>
      }
      
    </div>
  );
}

export default App;
