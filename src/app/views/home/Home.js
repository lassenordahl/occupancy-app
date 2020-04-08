import React, { useState, useEffect } from "react";
import "./Home.scss";

import "leaflet/dist/leaflet.css";
import { Redirect, useLocation, withRouter } from "react-router";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import { Card, Dialog } from "app/containers";
import { Legend, CoordinateMap, FloorMap } from "app/components";
import app_config from "globals/config";
import authGet from "../../../globals/authentication/AuthGet";
import api from "globals/api";
import LoadingBar from "react-top-loading-bar";

import { EntityInformation, OccupancyDialog } from "app/views";

import {
  serializeLocation,
  capitalizeWords,
} from "globals/utils/formatting-helper";
import moment from "moment";
import { transition } from "d3";

function Home(props) {
  // Variable to keep track of if we're loading the app for the first time
  const [firstLoad, setFirstLoad] = useState(true);
  const [errorLoading, setErrorLoading] = useState(false);

  // Dialog Information
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("building");
  const [dialogTitle, setDialogTitle] = useState("default");
  const [dialogTitleSubscript, setDialogTitleSubscript] = useState("default");

  // Redirecting variables
  const [willRedirect, redirect] = useState(false);
  const [newRoute, pushRoute] = useState(["occupancy", app_config.id]);

  // Entity Information
  // const [entity, setEntity] = useState({id: 1, name: 'ucitest'}); // Our selected entity
  const [entity, setEntity] = useState(null); // Our selected entity
  const [entityType, setEntityType] = useState(null);
  const [subEntities, setSubEntities] = useState([]); // Sub entities of our current selected entity
  const [occupancies, setOccupancies] = useState([]);
  const [occupancy, setOccupancy] = useState(0);

  // Date Selections
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [realtime, setRealtime] = useState(false);

  // Helper Variables
  const [legendMax, setLegendMax] = useState(0);
  const [progress, setProgress] = useState(100);
  const [showLegend, setShowLegend] = useState(true);
  const [transitionLegend, setTransitionLegend] = useState(false);

  let windowRoute = serializeLocation(useLocation());

  useEffect(() => {
    props.history.listen(function (location, action) {
      // New route comes from the URL
      let newRoute = serializeLocation(location);
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
    // getOccupancyData(subEntities, currentDate);
  }, [subEntities]);

  useEffect(() => {
    if (entity !== null) {
      // getOccupancy(entity.id);
    }
  }, [entity]);

  useEffect(() => {
    if (occupancies.length > 0) {
      let max = 0;
      for (let i = 0; i < occupancies.length; i++) {
        if (occupancies[i].payload !== undefined) {
          if (occupancies[i].payload.value > max) {
            max = occupancies[i].payload.value;
          }
        }
      }
      setLegendMax(max);
    }
  }, [occupancies]);

  function refreshOccupancies() {
    if (subEntities.length > 0) {
      getOccupancyData(subEntities, currentDate);
    }
  }

  function getRedirect() {
    let route;
    if (windowRoute.length === 1 && windowRoute[0] === "") {
      route = "/" + newRoute.join("/");
    } else {
      route = "/" + windowRoute.concat(newRoute).join("/");
    }
    return <Redirect to={route}></Redirect>;
  }

  async function parseUrlRoute(route, baseAppRoute) {
    // console.log('parse url route');
    // if (route.length === 1 && route[0] === "") {
    //   console.log(app_config);
    //   pushRoute(['occupancy', app_config.id]);
    //   return;
    // }
    // let entityIds = route.filter(function(routeElement, index) {
    //   return index % 2 === 1;
    // });
    // // Get all the entities listed in the URL
    // let entityResponses = await Promise.all(
    //   entityIds.map(function(id) {
    //     return authGet(api.entity + "/" + id);
    //   })
    // );
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
    setProgress(30);
    authGet(api.entity + "/" + entityId)
      .then(function (response) {
        let newEntity = response.data;
        setProgress(50);
        setEntity(newEntity);
        setEntityType(
          newEntity.payload.geo.coordinateSystem.coordinateSystemClassName
        );
        setSubEntities(newEntity.payload.geo.childSpaces);
        setErrorLoading(false);
      })
      .catch(function (error) {
        console.log("APP ENTITY GET", error);
        setErrorLoading(true);
      });
  }

  async function getOccupancyData(subEntities, time) {
    let occupancyResponses = await Promise.all(
      subEntities.map(function (subEntity) {
        return authGet(api.observation, {
          entityId: subEntity.id,
          orderBy: "timestamp",
          direction: "desc",
          limit: "1",
          before: moment(time).format("YYYY-MM-DD hh:mm:ss"),
        });
      })
    );

    setProgress(80);

    let occupancies = occupancyResponses.map(function (response, index) {
      if (response.data !== undefined) {
        let occupancyData = response.data[0];
        if (occupancyData === undefined) {
          occupancyData = { payload: { value: 0 } };
        }
        return occupancyData;
      } else {
        return 0;
      }
    });

    setProgress(100);
    setOccupancies(occupancies);
  }

  async function getOccupancy(id) {
    let occupancyResponse = await authGet(api.observation, {
      entityId: id,
      orderBy: "timestamp",
      direction: "desc",
      limit: "1",
    });
    if (occupancyResponse.data.length > 0) {
      setOccupancy(occupancyResponse.data[0].payload.value);
    }
  }

  function selectEntity(entity) {
    pushRoute([getEntityTypeName(entity), entity.id]);
  }

  function getEntityTypeName(entity) {
    return entity.entityTypeName;
  }

  // Opens a dialog using the information given
  function openDialog(entity, titleSubscript) {
    setRealtime(true);
    setDialogTitle(entity.name);
    setDialogTitleSubscript(titleSubscript);
    setShowDialog(true);
  }

  // Renders the coordinate map on the page if we need to select a geo object (GeoSubGeo, GeoSubNonGeo)
  function renderGPSMap() {
    return (
      <CoordinateMap
        entity={entity}
        coordinateEntities={subEntities}
        entityType={entityType}
        selectEntity={selectEntity}
        occupancies={occupancies}
        legendMax={legendMax}
      ></CoordinateMap>
    );
  }

  // Renders the floor map if we need to select a non-geo object (GeoSubNonGeo, NonGeoSubNonGeo)
  function render2DMap() {
    return (
      <FloorMap
        twoDimensionalEntities={subEntities}
        occupancies={occupancies}
        legendMax={legendMax}
      ></FloorMap>
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
      return (
        <React.Fragment>
          <h1>{capitalizeWords(entity.name)}</h1>
          <p>{capitalizeWords(entity.entityTypeName)}</p>
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
          openDialog={openDialog}
          occupancy={sumOccupancies()}
          occupancies={occupancies}
          // occupancy = {occupancy}
          refreshOccupancies={refreshOccupancies}
          currentDate={currentDate}
          setCurrentDate={setCurrentDate}
          fromDate={fromDate}
          setFromDate={setFromDate}
          toDate={toDate}
          setToDate={setToDate}
          progress={progress}
          realtime={realtime}
          setRealtime={setRealtime}
        ></EntityInformation>
      );
    }
  }

  function sumOccupancies() {
    let sum = 0;
    for (let i = 0; i < occupancies.length; i++) {
      sum +=
        occupancies[i].payload === undefined ? 0 : occupancies[i].payload.value;
    }
    return sum;
  }

  function renderMap() {
    if (errorLoading) {
      return (
        <React.Fragment>
          <h2 className="home-error">Error loading given entity :(</h2>
          <p className="home-error">It's okay, we'll fix it soon!</p>
        </React.Fragment>
      );
    }

    if (entityType === null) {
      return null;
    }

    if (
      entity.name === "Stanford 1100A" ||
      entity.name === "Stanford 1100B" ||
      entity.name === "Floor 2" ||
      entity.name === "Floor 1"
    ) {
      return render2DMap();
    }

    if (entityType === "gps" || entityType === "cartesian2hfd") {
      return renderGPSMap();
    } else {
      return render2DMap();
    }
  }

  return (
    <div className="Home">
      <LoadingBar
        progress={progress}
        height={4}
        color="blue"
        className="home-loading-bar"
      ></LoadingBar>

      {firstLoad ? <Redirect to="/"></Redirect> : null}
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

      { !errorLoading ? (
        <Card
          className={
            "fade-in legend-card " + (transitionLegend ? "legend-card-none" : "")
          }
          style={{ width: "240px" }}
        >
          <div
            className={
              "legend-header " +
              (transitionLegend ? "legend-header-margin" : "")
            }
          >
            <h2 style={{ marginBottom: "0px", fontSize: "1.8em" }}>Legend</h2>
            {showLegend ? (
              <FontAwesomeIcon
                icon={faCaretDown}
                onClick={function () {
                  setShowLegend(false);
                  setTimeout(() => {
                    setTransitionLegend(true);
                  }, 200);
                }}
              ></FontAwesomeIcon>
            ) : (
              <FontAwesomeIcon
                icon={faCaretUp}
                onClick={function () {
                  setTransitionLegend(false);
                  setTimeout(() => {
                    setShowLegend(true);
                  }, 500);
                }}
              ></FontAwesomeIcon>
            )}
          </div>
          <div
            className={
              "legend-content " + (showLegend ? "" : "legend-content-none")
            }
          >
            <Legend legendMax={legendMax}></Legend>
          </div>
        </Card>
      ) : null}

      { !errorLoading ? (
        <Card className="fade-in information-card" style={{ width: "360px" }}>
          <div className="information-header-wrapper">
            <div className="information-header">{renderTitle(entity)}</div>
          </div>
          <div className="information-tab-content">{renderView(entity)}</div>
        </Card>
      ) : null}
    </div>
  );
}

export default withRouter(Home);
