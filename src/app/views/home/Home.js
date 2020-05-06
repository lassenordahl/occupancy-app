import React, { useState, useEffect } from "react";
import "./Home.scss";

import "leaflet/dist/leaflet.css";
import { Redirect, useLocation, withRouter } from "react-router";
import moment from "moment";

import { Card, Dialog } from "app/containers";
import { Legend, CoordinateMap, FloorMap, SkeletonPulse } from "app/components";
import app_config from "globals/config";
import authGet from "../../../globals/authentication/AuthGet";
import api from "globals/api";
import LoadingBar from "react-top-loading-bar";
import { isValidUrl } from "globals/utils/tippers-helper";
import { EntityInformation, OccupancyDialog } from "app/views";
import {
  serializeLocation,
  capitalizeWords,
} from "globals/utils/formatting-helper";

function Home(props) {

  // Route of our application on load
  let windowRoute = serializeLocation(useLocation());

  // Variable to keep track of if we're loading the app for the first time
  const [errorLoading, setErrorLoading] = useState(false);

  // Dialog Information
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("building");
  const [dialogTitle, setDialogTitle] = useState("default");
  const [dialogTitleSubscript, setDialogTitleSubscript] = useState("default");

  // Redirecting variables
  const [willRedirect, redirect] = useState(false);
  const [newRoute, pushRoute] = useState(isValidUrl(windowRoute) ? [] : [app_config.id]);

  // Entity Information
  // const [entity, setEntity] = useState({id: 1, name: 'ucitest'}); // Our selected entity
  const [entity, setEntity] = useState(null); // Our selected entity
  const [entityType, setEntityType] = useState(null);
  const [subEntities, setSubEntities] = useState([]); // Sub entities of our current selected entity
  const [occupancies, setOccupancies] = useState([]);
  const [occupancy, setOccupancy] = useState(0);

  let oneWeekAgo = new Date();
  oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);

  // Date Selections
  const [fromDate, setFromDate] = useState(oneWeekAgo);
  const [toDate, setToDate] = useState(new Date());
  const [currentDate, setCurrentDate] = useState(new Date());
  const [realtime, setRealtime] = useState(true);

  // Helper Variables
  const [legendMax, setLegendMax] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showLegend, setShowLegend] = useState(true);
  const [transitionLegend, setTransitionLegend] = useState(false);

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
    // getOccupancyData(subEntities, currentDate);
    // if (entity !== null) {
    //   getOccupancy(entity.id, currentDate);
    // }
  }, [subEntities, currentDate]);

  useEffect(() => {
    if (occupancies.length > 0) {
      let max = 0;
      for (let i = 0; i < occupancies.length; i++) {
        if (occupancies[i] !== undefined) {
          if (occupancies[i].occupancy > max) {
            max = occupancies[i].occupancy;
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
    console.log(windowRoute);
    if (windowRoute.length === 1 && windowRoute[0] === "") {
      route = "/" + newRoute.join("/");
    } else {
      route = "/" + windowRoute.concat(newRoute).join("/");
    }
    console.log(route, newRoute);
    return <Redirect to={route}></Redirect>;
  }

  function getEntity(entityId) {
    if (entityId === null || entityId === "" || entityId === "home") {
      return;
    }
    authGet(api.entity + "/" + entityId)
      .then(function (response) {
        let newEntity = response.data;
        // Set progress, entity, and get the occupancy data for the enttiy
        setEntity(newEntity);
        console.log("NEW ENTITY", newEntity);
        // getOccupancy(entityId, currentDate);

        // If our payload isn't null, we can show the object by setting its type
        if (newEntity.payload.geo.coordinateSystem !== null) {
          setEntityType(
            newEntity.payload.geo.coordinateSystem.coordinateSystemClassName
          );
        }

        setSubEntities(newEntity.payload.geo.childSpaces);
        setErrorLoading(false);
      })
      .catch(function (error) {
        console.log("APP ENTITY GET", error);
        setErrorLoading(true);
      });
  }

  async function getOccupancyData(subEntities, time) {

    let timeDayEarlier = new Date(time.getTime());
    timeDayEarlier.setDate(time.getDate() - 1);

    setProgress(30);
    
    let occupancyResponses = await Promise.all(
      subEntities.map(function (subEntity) {
        return authGet(api.observation, {
          entityId: subEntity.id,
          orderBy: "timestamp",
          direction: "desc",
          limit: "1",
          before: moment(time).format("YYYY-MM-DD hh:mm:ss"),
          after: moment(timeDayEarlier).format("YYYY-MM-DD hh:mm:ss")
        });
      })
    );

    let occupancies = occupancyResponses.map(function (response, index) {
      if (index === occupancyResponses.length - 1) {
        setProgress(100);

      }
      if (response.data !== undefined && response.data.length > 0) {
        let occupancyData = response.data[0].payload;

        // If the data is undefined, let's make an invalid option
        if (occupancyData === undefined) {
          return {
            entityId: subEntities[index].id,
            occupancy: -1,
            validity: 300,
          };
        }
        occupancyData.timestamp = response.data.timestamp;
        return occupancyData;
      } else {
        return {
          entityId: subEntities[index].id,
          occupancy: -1,
          validity: 300,
        };
      }
    });

    setOccupancies(occupancies);
  }

  async function getOccupancy(id, time) {

    let timeDayEarlier = new Date(time.getTime());
    timeDayEarlier.setDate(time.getDate() - 1);

    let occupancyResponse = await authGet(api.observation, {
      entityId: id,
      orderBy: "timestamp",
      direction: "desc",
      limit: "1",
      before: moment(time).format("YYYY-MM-DD hh:mm:ss"),
      after: moment(timeDayEarlier).format("YYYY-MM-DD hh:mm:ss")
    });
    if (occupancyResponse.data !== undefined && occupancyResponse.data.length > 0) {
      setOccupancy({
        timestamp: occupancyResponse.data[0].timestamp,
        occupancy: occupancyResponse.data[0].payload.occupancy
      });
    } else {
      setOccupancy({
        timestamp: 0,
        occupancy: -1
      });
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
    setRealtime(false);
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
    return (
      <OccupancyDialog
        type={type}
        entity={entity}
        fromDate={fromDate}
        toDate={toDate}
      />
    );
  }

  // Renders a title based on the type of app we currently have loading
  function renderTitle(entity) {
    if (entity === null || entity === undefined) {
      return (
        <React.Fragment>
          <SkeletonPulse
            style={{ width: "100%", height: "3em" }}
          ></SkeletonPulse>
          <SkeletonPulse
            style={{ width: "100%", height: "2em", marginTop: "8px" }}
          ></SkeletonPulse>
        </React.Fragment>
      );
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
          occupancies={occupancies}
          // occupancy={sumOccupancies()}
          occupancy={occupancy}
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
      sum += occupancies[i].occupancy;
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

      {willRedirect ? getRedirect() : null}

      {renderMap()}

      {showDialog ? (
        <Dialog
          className="dialog"
          closeDialog={() => {
            setRealtime(true);
            setShowDialog(false);
          }}
          title={dialogTitle}
          titleSubscript={dialogTitleSubscript}
        >
          {renderDialogView(dialogType)}
        </Dialog>
      ) : null}

      {!errorLoading ? (
        <Legend
          transitionLegend={transitionLegend}
          showLegend={showLegend}
          legendMax={legendMax}
          setTransitionLegend={setTransitionLegend}
          setShowLegend={setShowLegend}
        ></Legend>
      ) : null}

      {!errorLoading ? (
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
