import React, { useState, useEffect } from "react";
import "./Home.scss";

import "leaflet/dist/leaflet.css";
import { Redirect, useRouteMatch, useLocation } from "react-router";
// import { useRouteMatch } from 'react-router';
// import { Trail } from 'react-spring/renderprops';
import axios from 'axios';

import { Card, Dialog } from "app/containers";

import { Legend, CoordinateMap, FloorMap } from "app/components";

import {
  // BuildingInformation,
  // GlobalInformation,
  // FloorInformation,
  EntityInformation,
  OccupancyDialog
} from "app/views";

import {
  serializeLocation
} from "globals/utils/formatting-helper";

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
  const [currentRoute, setCurrentRoute] = useState([]);

  // Our selected entity
  const [entity, setEntity] = useState(null);
  // Sub entities of our current selected entity
  const [subEntities, setSubEntities] = useState([]);

  const [entityType, setEntityType] = useState(null);

  let windowRoute = serializeLocation(useLocation());


  useEffect(() => {
    setCurrentRoute(props.appRoute);
  }, [props.appRoute]);

  useEffect(() => {
    // If we just redirected, reset the variable so we can redirect again later
    if (willRedirect) redirect(false);
  }, [willRedirect]);

  useEffect(() => {
    // If our current route changes, we should trigger a redirect
    redirect(true);
  }, [currentRoute]);

  useEffect(() => {
    if (firstLoad) {
      parseUrlRoute(windowRoute, props.appRoute);
      setFirstLoad(false);
    }
  }, [firstLoad]);

  useEffect(() => {
    console.log(entity);
  }, [entity]);

  function getRedirect() {
    let route = "/" + currentRoute.join("/");
    return <Redirect from="/" to={route}></Redirect>;
  }

  async function parseUrlRoute(route, baseAppRoute) {
    let entityIds = route.filter(function(routeElement, index) {
      return index % 2 === 1;
    });

    // Get all the entities listed in the URL
    let entityResponses = await Promise.all(entityIds.map(function(id) {
      return axios.get("http://128.195.53.189:4001/api/entity/" + id);
    }));

    if (entityResponses.length === 0) {
      // If we have no valid entities, use the valid route that was given at the root of the application
      setCurrentRoute(baseAppRoute);
    } else {
      setCurrentRoute(route);

      let entities = entityResponses.map(function(response) {
        return response.data;
      });
      
      let selectedEntity = entities[entities.length - 1];
      let selectedEntityType = selectedEntity.payload.geo.coordinateSystem.coordinateSystemClassName;
      setEntity(selectedEntity);
      setEntityType(selectedEntityType);
    }
  }

  function selectEntity(entity) {
    console.log(entity);
    // setCurrentRoute([...currentRoute, entity.entityTypeName, entity.id]);
  }

  // Opens a dialog using the information given
  function openDialog(title, titleSubscript) {
    setDialogTitle(title);
    setDialogTitleSubscript(titleSubscript);
    setShowDialog(true);
  }

  // Renders the coordinate map on the page if we need to select a geo object (GeoSubGeo, GeoSubNonGeo)
  function renderGPSMap() {
    return (
      <CoordinateMap
        appEntity={props.appEntity}
        coordinateEntities={subEntities}
      ></CoordinateMap>
    );
  }

  // Renders the floor map if we need to select a non-geo object (GeoSubNonGeo, NonGeoSubNonGeo)
  function render2DMap() {
    return (
      <FloorMap></FloorMap>
    );
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
      return  (
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
      return <EntityInformation entity={entity} selectEntity={selectEntity}></EntityInformation>
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

export default Home;
