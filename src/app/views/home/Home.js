import React, { useState, useEffect } from "react";
import "./Home.scss";

import "leaflet/dist/leaflet.css";
import { Redirect, useLocation, withRouter } from "react-router";

import { Card, Dialog } from "app/containers";
import { Legend, CoordinateMap, FloorMap } from "app/components";
import app_config from "globals/config";
import authGet from "../../../globals/authentication/AuthGet";
import api from "globals/api";

import { EntityInformation, OccupancyDialog } from "app/views";

import { serializeLocation } from "globals/utils/formatting-helper";

function Home(props) {
  // Variable to keep track of if we're loading the app for the first time
  const [firstLoad, setFirstLoad] = useState(true);

  // Dialog Information
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("building");
  const [dialogTitle, setDialogTitle] = useState("default");
  const [dialogTitleSubscript, setDialogTitleSubscript] = useState("default");

  // Redirecting variables
  const [willRedirect, redirect] = useState(false);
  const [newRoute, pushRoute] = useState(['occupancy', app_config.id]);

  const [entity, setEntity] = useState(null); // Our selected entity
  const [subEntities, setSubEntities] = useState([]);  // Sub entities of our current selected entity
  const [occupancies, setOccupancies] = useState([]);

  const [entityType, setEntityType] = useState(null);

  let windowRoute = serializeLocation(useLocation());
  // // This UseEffect listens for route changes from the remainder of the application
  useEffect(() => {
    props.history.listen(function(location, action) {
      // New route comes from the URL
      let newRoute = serializeLocation(location);
   
      // setCurrentRoute(newRoute);
      // parseUrlRoute()

      // If we have an entity at the end, we can load it as our home screen
      if (newRoute.length > 0) {
        getEntity(newRoute[newRoute.length - 1]);
      }
    });
  }, []);

  useEffect(() => {
    // If we just redirected, reset the variable so we can redirect again later
    if (willRedirect) {
      redirect(false);
    }
  }, [willRedirect]);

  useEffect(() => {
    // If our current route changes, we should trigger a redirect
    redirect(true);
  }, [newRoute]);

  useEffect(() => {
    if (firstLoad) {
      parseUrlRoute(windowRoute);
      setFirstLoad(false);
    }
  }, [firstLoad]);

  useEffect(() => {
    console.log('getting occupancy data for ', subEntities);
    getOccupancyData(subEntities);
  }, [subEntities]);

  function getRedirect() {
    console.log("redirecting", windowRoute);

    let route;
    if (windowRoute.length === 1 && windowRoute[0] === '') {
      route = '/' + newRoute.join('/');
    } else {
      route = '/' + windowRoute.concat(newRoute).join('/');
    }
    console.log(route);
    return <Redirect to={route}></Redirect>;
  }

  async function parseUrlRoute(route, baseAppRoute) {
    // console.log(route, route.length);
    // if (route.length === 1 && route[0] === "") {
    //   console.log(app_config);
    //   pushRoute(['occupancy', app_config.id]);
    //   return;
    // }
    let entityIds = route.filter(function(routeElement, index) {
      return index % 2 === 1;
    });

    // Get all the entities listed in the URL
    let entityResponses = await Promise.all(
      entityIds.map(function(id) {
        return authGet(api.entity + "/" + id);
      })
    );

    // if (entityResponses.length === 0) {
    //   // If we have no valid entities, use the valid route that was given at the root of the application
    //   // setCurrentRoute(baseAppRoute);
    // } else {
    //   // pushRoute(route);

    //   let entities = entityResponses.map(function(response) {
    //     return response.data;
    //   });

    //   let selectedEntity = entities[entities.length - 1];
    //   console.log(selectedEntity);
    //   let selectedEntityType =
    //     selectedEntity.payload.geo.coordinateSystem.coordinateSystemClassName;
    //   setEntity(selectedEntity);
    //   setEntityType(selectedEntityType);
    //   if (selectedEntity.payload.geo.childSpaces !== undefined) {
    //     setSubEntities(selectedEntity.payload.geo.childSpaces);
    //   }
    //   // getSubEntities(selectedEntityType, selectedEntity.id);
    // }
  }

  function getEntity(entityId) {
    if (entityId === null || entityId === "") {
      return;
    }
    authGet(api.entity + "/" + entityId)
      .then(function(response) {
        let entity = response.data;
        // Sets the app entity

        setEntity(entity);
        setEntityType(
          entity.payload.geo.coordinateSystem.coordinateSystemClassName
        );
        setSubEntities(entity.payload.geo.childSpaces);
      })
      .catch(function(error) {
        console.log("APP ENTITY GET", error);
      });
  }

  async function getOccupancyData(subEntities) {
    console.log(subEntities);

    let occupancyResponses = await Promise.all(
      subEntities.map(function(subEntity) {
        console.log(subEntity);
        return authGet(api.observation, {
          orderBy: 'timestamp',
          direction: 'desc',
          limit: 50
        });
      })
    );

    let occupancies = occupancyResponses.map(function(response, index) {
      let occupancyData = response.data;
      for (var i = 0; i < occupancyData.length; i++) {
        if (occupancyData[i].payload.entityId === subEntities[index].id) {
          return occupancyData[i].payload.value;
        }
      }
      return 0;
    })

    console.log("OCCUPANCY", occupancyResponses, occupancies);

    setOccupancies(occupancies);
  }

  function selectEntity(entity) {
    pushRoute([getEntityTypeName(entity), entity.id]);
  }

  function getEntityTypeName(entity) {
    console.log("ENTITY TYPE NAME", entity);
    return entity.entityTypeName;
  }

  // Opens a dialog using the information given
  function openDialog(title, titleSubscript) {
    setDialogTitle(title);
    setDialogTitleSubscript(titleSubscript);
    setShowDialog(true);
  }

  // Renders the coordinate map on the page if we need to select a geo object (GeoSubGeo, GeoSubNonGeo)
  function renderGPSMap() {
    // console.log('RENDERING MAP', entitysubEntities);
    return (
      <CoordinateMap
        entity={entity}
        coordinateEntities={subEntities}
        entityType={entityType}
        selectEntity={selectEntity}
      ></CoordinateMap>
    );
  }

  // Renders the floor map if we need to select a non-geo object (GeoSubNonGeo, NonGeoSubNonGeo)
  function render2DMap() {
    return <FloorMap twoDimensionalEntities={subEntities}></FloorMap>;
  }

  // Renders the dialog
  function renderDialogView(type) {
    return <OccupancyDialog type={type} entity={entity} />;
  }

  // Renders a title based on the type of app we currently have loading
  function renderTitle(entity) {
    if (entity === null || entity === undefined) {
      return null;
    } else {
      return (
        <React.Fragment>
          <h1>{entity.name}</h1>
        </React.Fragment>
      );
    }
  }

  // Renders the side panel that we can view the information for
  function renderView(entity) {
    // If we are in a geosubgeo app type
    // We can render the global view of the campus, and the building information
    if (entity === null) {
      return null;
    } else {
      return (
        <EntityInformation
          entity={entity}
          selectEntity={selectEntity}
          subEntities={subEntities}
          occupancy={occupancies.reduce(function(a, b) {
            return a + b;
          }, 0)}
        ></EntityInformation>
      );
    }
  }


  function renderMap() {
    if (entityType === null) {
      return null;
    }

    if (entityType === "gps" || entityType === "cartesian2hfd") {
      return renderGPSMap();
    } else {
      return render2DMap();
    }
  }

  return (
    <div className="Home">
      {willRedirect ? getRedirect() : null}

      {renderMap()}

      {showDialog ? (
        <Dialog
          className="dialog"
          closeDialog={() => setShowDialog(false)}
          title={dialogTitle}
          titleSubscript={dialogTitleSubscript}
        >
          {renderDialogView(dialogType)}
        </Dialog>
      ) : null}

      <Card className="legend-card" style={{ width: "280px" }}>
        <div className="legend-header">
          <h1>Legend</h1>
        </div>
        <div className="legend-content">
          <Legend></Legend>
        </div>
      </Card>

      <Card className="information-card" style={{ width: "400px" }}>
        <div className="information-header">{renderTitle(entity)}</div>
        <div className="information-tab-content">{renderView(entity)}</div>
      </Card>
    </div>
  );
}

export default withRouter(Home);
