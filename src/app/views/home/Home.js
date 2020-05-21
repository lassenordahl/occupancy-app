import React, { useState, useEffect } from "react";
import "./Home.scss";

import "leaflet/dist/leaflet.css";
import { Redirect, useLocation, useHistory, withRouter } from "react-router";
import moment from "moment";
import _ from "lodash";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

import { Card, Dialog } from "app/containers";
import { Legend, CoordinateMap, FloorMap, SkeletonPulse } from "app/components";
import config from "globals/config";
import authGet from "../../../globals/authentication/AuthGet";
import api from "globals/api";
import LoadingBar from "react-top-loading-bar";
import { isValidUrl } from "globals/utils/tippers-helper";
import { EntityInformation, OccupancyDialog } from "app/views";
import { useQueryParams, useToast } from "globals/hooks";
import {
  serializeLocation,
  capitalizeWords,
  getQueryString,
} from "globals/utils/formatting-helper";

function Home(props) {
  // Hooks
  let windowRoute = serializeLocation(useLocation());
  let queryParams = useQueryParams();
  let history = useHistory();
  const [showSuccess, showError, renderToast] = useToast();

  // Variable to keep track of if we're loading the app for the first time
  const [errorLoading, setErrorLoading] = useState(false);

  // Dialog Information
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("building");
  const [dialogTitle, setDialogTitle] = useState("default");
  const [dialogTitleSubscript, setDialogTitleSubscript] = useState("default");

  // Redirecting variables
  const [willRedirect, redirect] = useState(false);
  const [newRoute, pushRoute] = useState(
    isValidUrl(windowRoute) ? [] : [config.id]
  );

  // Entity Information
  // const [entity, setEntity] = useState({id: 1, name: 'ucitest'}); // Our selected entity
  const [entity, setEntity] = useState(null); // Our selected entity
  const [entityType, setEntityType] = useState(null);
  const [subEntities, setSubEntities] = useState([]); // Sub entities of our current selected entity
  const [occupancies, setOccupancies] = useState({});
  const [occupancy, setOccupancy] = useState({timestamp: 0, occupancy: -1});

  let oneWeekAgo =
    queryParams.toDate !== undefined
      ? new Date(Date.parse(queryParams.toDate))
      : new Date();
  if (queryParams.toDate === undefined) {
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
  }

  // Date Selections
  const [fromDate, setFromDate] = useState(oneWeekAgo);
  const [toDate, setToDate] = useState(
    queryParams.toDate !== undefined
      ? new Date(Date.parse(queryParams.toDate))
      : new Date()
  );
  const [currentDate, setCurrentDate] = useState(
    queryParams.currentDate !== undefined
      ? new Date(Date.parse(queryParams.currentDate))
      : new Date()
  );
  const [realtime, setRealtime] = useState(
    // queryParams.realtime !== undefined ? queryParams.realtime === "true" : true
    true
  );

  // Helper Variables
  const [legendMax, setLegendMax] = useState(0);
  const [progress, setProgress] = useState(0);
  const [showLegend, setShowLegend] = useState(true);
  const [transitionLegend, setTransitionLegend] = useState(false);
  const [hideEntityCard, setHideEntityCard] = useState(false);

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
    getOccupancyData(entity, subEntities, currentDate);
    // if (entity !== null) {
    //   getOccupancy(entity.id, currentDate);
    // }
  }, [subEntities, currentDate]);

  useEffect(() => {
    // If one of these changes, we need to update the URL parameters
    let newQueryParams = {
      currentDate: moment(currentDate).toISOString(),
      fromDate: moment(fromDate).toISOString(),
      toDate: moment(toDate).toISOString(),
      realtime: realtime,
    };

    // Only repull if the query params are different
    if (!_.isEqual(newQueryParams, queryParams)) {
      history.push("?" + getQueryString(newQueryParams));
    }
  }, [currentDate, fromDate, toDate, realtime]);

  useEffect(() => {
    // if (occupancies.length > 0) {
    //   let max = 0;
    //   for (let i = 0; i < occupancies.length; i++) {
    //     if (occupancies[i] !== undefined) {
    //       if (occupancies[i].occupancy > max) {
    //         max = occupancies[i].occupancy;
    //       }
    //     }
    //   }
    //   setLegendMax(max);
    // }
    let max = 0;
    for (let [entityId, occupancyObject] of Object.entries(occupancies)) {
      if (occupancyObject.occupancy > max) {
        max = occupancyObject.occupancy;
      }
    }
    setLegendMax(max);
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
    return <Redirect to={route + "?" + getQueryString(queryParams)}></Redirect>;
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
        showError("Error loading entity");
        setErrorLoading(true);
      });
  }

  async function getOccupancyData(entity, subEntities, time) {
    let timeDayEarlier = new Date(time.getTime());
    timeDayEarlier.setDate(time.getDate() - 1);

    setProgress(30);

    let query = {
      "query": "select `id`, MAX(`timestamp`) as timestamp, `deviceId`, `entityId`, `occupancy`, `validity` from `occupancy_vs_observation` where `entityId` in (" + subEntities.map((subEntity) => subEntity.id).join(",") + (entity !== null ? ("," + entity.id) : "") + ") group by `entityId`;"
    }

    axios.post(api.query, query)
    .then(function(response) {
      if (response.status === 200) {
        let occupancies = {};
        for (let i = 0; i < response.data.length; i++) {
          occupancies[response.data[i].entityId] = response.data[i];
        }
        setProgress(100);
        setOccupancies(occupancies);
      }
    });
  }

  function getOccupancy(id) {
    return id !== undefined && occupancies[id] !== undefined ? occupancies[id] : -1;
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
        occupancy={getOccupancy(entity.id)}
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
          occupancy={getOccupancy(entity.id)}
          // occupancy={occupancy}
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
      {renderToast()}
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

      {!errorLoading && entityType !== "cartesian2hfd" ? (
        <Legend
          transitionLegend={transitionLegend}
          showLegend={showLegend}
          legendMax={legendMax}
          setTransitionLegend={setTransitionLegend}
          setShowLegend={setShowLegend}
        ></Legend>
      ) : null}

      <div className="visible-entity-button maximize-entity-button" onClick={() => setHideEntityCard(false)}>
        <FontAwesomeIcon icon={faCaretUp}></FontAwesomeIcon>
      </div>

      {!errorLoading && !hideEntityCard ? (
        <Card className="slide-up-fade-in information-card">
          <div className="information-header-wrapper">
            <div className="visible-entity-button minimize-entity-button" onClick={() => setHideEntityCard(true)}>
              <FontAwesomeIcon icon={faCaretDown}></FontAwesomeIcon>
            </div>
            <div className="information-header">
              {renderTitle(entity)}
            </div>
          </div>
          <div className="information-tab-content">{renderView(entity)}</div>
        </Card>
      ) : null}
    </div>
  );
}

export default withRouter(Home);
