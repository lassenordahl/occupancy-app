import React, { useState, useEffect } from "react";
import "./Home.scss";

import "leaflet/dist/leaflet.css";
import { Redirect, useLocation, withRouter } from "react-router";
import axios from "axios";

import { Card, Dialog } from "app/containers";

import { Legend, CoordinateMap, FloorMap } from "app/components";

import {
  // BuildingInformation,
  // GlobalInformation,
  // FloorInformation,
  EntityInformation,
  OccupancyDialog
} from "app/views";

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
  const [currentRoute, setCurrentRoute] = useState([]);

  // Our selected entity
  const [entity, setEntity] = useState(null);
  // Sub entities of our current selected entity
  const [subEntities, setSubEntities] = useState([]);

  const [entityType, setEntityType] = useState(null);

  let windowRoute = serializeLocation(useLocation());

  // This UseEffect listens for route changes from the remainder of the application
  useEffect(() => {
    props.history.listen(function(location, action) {
      // New route comes from the URL
      let newRoute = serializeLocation(location);
      setCurrentRoute(newRoute);

      // If we have an entity at the end, we can load it as our home screen
      if (newRoute.length > 0) {
        getEntity(newRoute[newRoute.length - 1]);
      }
    });
  }, []);

  useEffect(() => {
    if (entity !== null) {
      getSubEntities(entityType, entity.id);
    }
  }, [entity]);

  useEffect(() => {
    console.log(subEntities);
  }, [subEntities]);

  useEffect(() => {
    // Initializes our current route to the app route from the config of the application
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
    let entityResponses = await Promise.all(
      entityIds.map(function(id) {
        return axios.get("http://128.195.53.189:4001/api/entity/" + id);
      })
    );

    if (entityResponses.length === 0) {
      // If we have no valid entities, use the valid route that was given at the root of the application
      setCurrentRoute(baseAppRoute);
    } else {
      setCurrentRoute(route);

      let entities = entityResponses.map(function(response) {
        return response.data;
      });

      let selectedEntity = entities[entities.length - 1];
      console.log(selectedEntity);
      let selectedEntityType =
        selectedEntity.payload.geo.coordinateSystem.coordinateSystemClassName;
      setEntity(selectedEntity);
      setEntityType(selectedEntityType);
      getSubEntities(selectedEntityType, selectedEntity.id);
    }
  }

  function getEntity(entityId) {
    if (entityId === null || entityId === "") {
      return;
    }
    axios
      .get("http://128.195.53.189:4001/api/entity/" + entityId)
      .then(function(response) {
        let entity = response.data;
        // Sets the app entity
        setEntity(entity);
        setEntityType(
          entity.payload.geo.coordinateSystem.coordinateSystemClassName
        );
        getSubEntities(entity.payload.geo.coordinateSystem.coordinateSystemClassName, entity.id);
      })
      .catch(function(error) {
        console.log("APP ENTITY GET", error);
      });
  }

  function getSubEntities(entityType, entityId) {
    if (entityType === "gps") {
      setSubEntities([
        {
          id: 3,
          name: "Donald Bren Hall",
          entityClassId: 2,
          entityClassName: "space",
          entityTypeId: 5,
          entityTypeName: "building",
          payload: {
            geo: {
              extent: {
                end: {
                  latitude: 33.1,
                  longitude: 33.1
                },
                start: {
                  latitude: 33,
                  longitude: 33
                },
                extentClassName: "rectangle"
              },
              parentSpaceId: 1,
              coordinateSystem: {
                range: {
                  xMax: 1000,
                  xMin: 0,
                  yMax: 1000,
                  yMin: 0,
                  floorMax: 6,
                  floorMin: 1
                },
                coordinateSystemClassName: "cartesian2hfd"
              }
            }
          }
        }
      ]);
    } else if (entityType === "cartesian2hfd") {
      setSubEntities([
        {
          id: 4,
          name: "floor 2",
          entityClassId: 2,
          entityClassName: "space",
          entityTypeId: 7,
          entityTypeName: "floor",
          payload: {
            geo: {
              extent: {
                end: {
                  x: 1000,
                  y: 1000,
                  floor: 2
                },
                start: {
                  x: 0,
                  y: 0,
                  floor: 2
                },
                extentClassName: "rectangle"
              },
              parentSpaceId: 1,
              coordinateSystem: {
                range: {
                  xMax: 1000,
                  xMin: 0,
                  yMax: 1000,
                  yMin: 0
                },
                coordinateSystemClassName: "cartesian2d"
              }
            }
          }
        }
      ]);
    } else if (entityType === "cartesian2d") {
      setSubEntities([
        {
          id: 5,
          name: "Living Room",
          entityClassId: 2,
          entityClassName: "space",
          entityTypeId: 5,
          entityTypeName: "Room",
          payload: {
            geo: {
              extent: {
                end: {
                  x: 70,
                  y: 70
                },
                start: {
                  x: 50,
                  y: 50
                },
                extentClassName: "rectangle"
              },
              parentSpaceId: 1,
              coordinateSystem: {
                range: {
                  xMax: 200,
                  xMin: 0,
                  yMax: 100,
                  yMin: 0
                },
                coordinateSystemClassName: "cartesian2d"
              }
            }
          }
        },
        {
          id: 6,
          name: "Kitchen",
          entityClassId: 2,
          entityClassName: "space",
          entityTypeId: 5,
          entityTypeName: "Room",
          payload: {
            geo: {
              extent: {
                end: {
                  x: 70,
                  y: 40
                },
                start: {
                  x: 60,
                  y: 0
                },
                extentClassName: "rectangle"
              },
              parentSpaceId: 1,
              coordinateSystem: {
                range: {
                  xMax: 200,
                  xMin: 0,
                  yMax: 100,
                  yMin: 0
                },
                coordinateSystemClassName: "cartesian2d"
              }
            }
          }
        },
        {
          id: 7,
          name: "Kitchen",
          entityClassId: 2,
          entityClassName: "space",
          entityTypeId: 5,
          entityTypeName: "Room",
          payload: {
            geo: {
              extent: {
                end: {
                  x: 50,
                  y: 50
                },
                start: {
                  x: 0,
                  y: 0
                },
                extentClassName: "rectangle"
              },
              parentSpaceId: 1,
              coordinateSystem: {
                range: {
                  xMax: 200,
                  xMin: 0,
                  yMax: 100,
                  yMin: 0
                },
                coordinateSystemClassName: "cartesian2d"
              }
            }
          }
        }
      ]);
    }
  }

  function selectEntity(entity) {
    console.log('SELECTED AN ENTITY', entity);
    setCurrentRoute([...currentRoute, getEntityTypeName(entity), entity.id]);
    getEntity(entity.id);
  }

  function getEntityTypeName(entity) {
    console.log('ENTITY TYPE NAME', entity);
    return entity.entityTypeName;
    if (entity.entityType === undefined) {
      return entity.entityTypename;
    } else {
      return entity.entityType.entityTypeName;
    }
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
        entity={props.entity}
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
