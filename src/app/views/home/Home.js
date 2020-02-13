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
  BuildingInformation,
  GlobalInformation,
  FloorInformation,
  OccupancyDialog
} from "app/views";

import {
  serializeLocation
} from "globals/utils/formatting-helper";

function Home(props) {
  // Variable to keep track of if we're loading the app for the first time
  const [firstLoad, setFirstLoad] = useState(true);

  // View for Home.js
  const [view, setView] = useState(null);

  // Dialog Information
  const [showDialog, setShowDialog] = useState(false);
  const [dialogType, setDialogType] = useState("building");
  const [dialogTitle, setDialogTitle] = useState("default");
  const [dialogTitleSubscript, setDialogTitleSubscript] = useState("default");

  // Sub entities, this needs to be changed to sub
  const [buildingEntities, setBuildingEntities] = useState([]);

  // Selected building, floor, and room info, also needs to be changed
  const [building, setBuilding] = useState(null);
  const [floorNumber, setFloorNumber] = useState(null);

  // Redirecting variables
  const [willRedirect, redirect] = useState(false);
  const [currentRoute, setCurrentRoute] = useState([]);

  let windowRoute = serializeLocation(useLocation());

  /**
   *
   */
  useEffect(() => {
    // let urlBuildingId = props.match.params.buildingId;
    let floorId = props.match.params.floorId;
    // alert(props.match.params.buildingId);
    // alert(props.match.params.floorId);
    if (floorId === undefined) {
      setFloorNumber(null);
    } else {
      setFloorNumber(floorId);
    }
    // if url building id is not in the valid id's then we can just set it to be nothing
  }, [props.match.params.buildingId, props.match.params.floorId]);

  useEffect(() => {
    // Our app entity
    // Here we don't auto select anything and show a global view
    setView(props.appType);
  }, [props.appType]);

  useEffect(() => {
    getBuildingEntities();
  }, []);

  useEffect(() => {
    console.log("useffect", props.appRoute)
    setCurrentRoute(props.appRoute);
  }, [props.appRoute]);

  useEffect(() => {
    // If we just redirected, reset the variable so we can redirect again later
    console.log('redirecting');
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

  function getRedirect() {
    let route = "/" + currentRoute.join("/");
    return <Redirect from="/" to={route}></Redirect>;
  }

  async function parseUrlRoute(route, baseAppRoute) {
    let entityIds = route.filter(function(routeElement, index) {
      return index % 2 === 1;
    });

    let entityResponses = await Promise.all(entityIds.map(function(id) {
      return axios.get("http://128.195.53.189:4001/api/entity/" + id);
    }));

    console.log(entityResponses);

    if (entityResponses.length === 0) {
      setCurrentRoute(baseAppRoute);
    } else {
      setCurrentRoute(route);
    }

    if (props.appType === "GeoSubGeo") {
      if (entityResponses.length >=2 ) {
        console.log(entityResponses[1].data);
        setBuilding(entityResponses[1].data);
      }
    }
  }

  // TODO: This shouldn't get buildings specifically, it should grab the next level down in the heirarchy
  function getBuildingEntities() {
    // axios.get(http://128.195.53.189:4001/api/entity/search?orderBy=id&direction=ASC&orderBy2=id&direction2=ASC&limit=25&entityTypeName=building)
    setBuildingEntities(
      {
        resultCode: 100,
        message: "Entities found with search parameters.",
        entities: [
          {
            id: 3,
            name: "DBH",
            entityType: {
              subtypeOf: 2,
              entityTypeName: "building",
              entityTypeId: 5
            },
            payload: {
              geoId: 3
            }
          }
        ]
      }.entities
    );
  }

  // Select building is run when we select a geolocation block
  function selectBuilding(building) {
    console.log(building);
    building = {
      id: 3,
      name: "DBH",
      entityType: {subtypeOf: 2, entityTypeName: "building", entityTypeId: 5},
      payload: {geoId: 3},
      geo: {
        extent: {},
        extentClassId: 3,
        start: {latitude: 33.642992, longitude: -117.8422864},
        extentClassName: "rectangle",
        end: {latitude: 33.6435452, longitude: -117.8414719},
        parentSpaceId: 2,
        coordinateSystem: {},
        coordinateSystemClassName: "coordinateSystem2hfd",
        range: {yMin: 0, yMax: 1000, floorMin: 1, xMax: 1000, floorMax: 6},
        coordinateSystemClassId: 3
      },
      floorCount: 6,
      buildingId: 3,
      occupancy: 87,
      description: "Building in UCI",
      coordinates: [
        [33.642992, -117.8422864],
        [33.642992, -117.8414719],
        [33.6435452, -117.8414719],
        [33.6435452, -117.8422864]
      ]
    }
    
    setBuilding(building);
    if (view === "GeoSubGeo") {
      // If the current route is less than 3, then it's okay to add these to the end of the current route
      if (currentRoute.length < 3) {
        setCurrentRoute([
          ...currentRoute,
          props.routes[1],
          building.id
        ]);
      }
    }
  }

  // Sets the building to be null and changes the route
  function resetBuilding() {
    setBuilding(null);

    // Not sure why this resets to ['roottype'], it should be initialized to an empty array and there will be no URL anymore
    setCurrentRoute([]);
  }

  // Resets the building to the building that we selected (this maintains the selected building and deselects a room)
  function resetSelectedBuilding() {
    if (building !== undefined && building !== null) {
      setCurrentRoute([currentRoute[0], currentRoute[1], currentRoute[2]]);
      // props.history.push('/geolocation/' + building.buildingId);
    } else {
      alert("Null building url");
    }
  }

  // Opens a floor
  function openFloor(floorNumber) {
    setFloorNumber(floorNumber);

    if (currentRoute.length < 5) {
      setCurrentRoute([...currentRoute, props.routes[2], floorNumber]);
    }
  }

  // Select room is run when we select a room from the floor map
  function selectRoom(room) {
    // setRoom(room);

    // If the sub-level isn't defined, we shouldn't be able to select a room
    if (building !== undefined && building !== null) {
      // props.history.push('/geolocation/' + building.buildingId + '/floor/' + floorNumber + '/room/' + room.name);
    } else {
      alert("Building is null");
    }
  }

  // Opens a dialog using the information given
  function openDialog(buildingType, title, titleSubscript) {
    setDialogType(buildingType);
    setDialogTitle(title);
    setDialogTitleSubscript(titleSubscript);
    setShowDialog(true);
  }

  // Renders the coordinate map on the page if we need to select a geo object (GeoSubGeo, GeoSubNonGeo)
  function conditionalMap() {
    return (
      <CoordinateMap
        selectBuilding={selectBuilding}
        appEntity={props.appEntity}
        buildingEntities={buildingEntities}
      ></CoordinateMap>
    );
  }

  // Renders the floor map if we need to select a non-geo object (GeoSubNonGeo, NonGeoSubNonGeo)
  function conditionalFloorMap() {
    return <FloorMap selectRoom={selectRoom}></FloorMap>;
  }

  // Renders the dialog
  function renderDialogView(type) {
    let entityId = null;
    if (type === "building" && building !== null) {
      entityId = building.buildingId;
    }
    return <OccupancyDialog type={type} entity={entityId} />;
  }

  // Renders a title based on the type of app we currently have loading
  function renderTitle() {
    // Renders GeoSubGeo
    // This renders the main app entity name and then the building (sub-entity that we have selected)
    if (view === "GeoSubGeo") {
      return (
        <React.Fragment>
          <h1 onClick={() => resetBuilding()}>{props.appEntity.name}</h1>
          {building !== null ? (
            <p>
              &nbsp;&nbsp;>&nbsp;&nbsp;
              <span
                style={building.name.length > 15 ? { fontSize: "20px" } : null}
              >
                {building.name}
              </span>
            </p>
          ) : null}
        </React.Fragment>
      );

      // Renders GeoSubNonGeo
      // This renders a title where we have a pre-selected building (there is no parent entity like campus -> building)
    } else if (view === "GeoSubNonGeo") {
      return (
        <React.Fragment>
          <h1>{props.appEntity.name}</h1>
        </React.Fragment>
      );

      // Renders NonGeoSubNonGeo
      // This renders a title where we have a floor pre-selected, and the rooms are the available spaces we can search
    } else if (view === "NonGeoSubNonGeo") {
      return (
        <React.Fragment>
          <h1 onClick={() => resetSelectedBuilding()}>
            {building !== null ? building.name : "Default"}
          </h1>
          <p>&nbsp;&nbsp;>&nbsp;&nbsp;Floor {floorNumber}</p>
        </React.Fragment>
      );
    }
  }

  // Renders the side panel that we can view the information for
  function renderView() {
    // If we are in a geosubgeo app type
    // We can render the global view of the campus, and the building information
    if (view === "GeoSubGeo") {
      if (currentRoute.length < 6) {
        return (
          <React.Fragment>
            {building !== null ? (
              // We aren't always showing the global view, only show it if we have a global entity like campus->building
              <BuildingInformation
                building={building}
                openFloor={openFloor}
                history={props.history}
                openDialog={openDialog}
              />
            ) : (
              <GlobalInformation openDialog={openDialog} />
            )}
          </React.Fragment>
        );
      } else {
        return (
          <React.Fragment>
            <FloorInformation>
              {/* {floor !== null ? <div></div> : null} */}
            </FloorInformation>
          </React.Fragment>
        )
      }
      
      // Render just the building information because we will have no global entity to show information for
    } else if (view === "GeoSubNonGeo") {
      return (
        <React.Fragment>
          {building !== null ? (
            <BuildingInformation
              building={building}
              openFloor={openFloor}
              history={props.history}
              openDialog={openDialog}
            />
          ) : null}
        </React.Fragment>
      );
    }
  }

  return (
    <div className="Home">
      {/* If our floor number isn't null, we should redirect there */}
      {willRedirect ? getRedirect() : null}
      {/* { floorNumber !== null ? <Redirect to={`${url}/floor/${floorNumber}`}></Redirect> : null} */}
      {floorNumber === null ? conditionalMap() : conditionalFloorMap()}
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
        <div className="information-header">{renderTitle()}</div>
        <div className="information-tab-content">{renderView()}</div>
      </Card>
    </div>
  );
}

export default Home;
