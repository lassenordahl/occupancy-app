import React, { useState, useEffect } from "react";
import "./CoordinateMap.scss";

import { Map, TileLayer, Marker, Popup, Polygon, Tooltip } from "react-leaflet";
import uciMap from "globals/test-data/uci-map.js";
import blueRainbow from "globals/utils/rainbowvis-helper.js";
import axios from "axios";

const state = {
  lat: 33.6405,
  lng: -117.8443,
  zoom: 13
};

const position = [state.lat, state.lng];

function CoordinateMap(props) {
  const [appGeo, setAppGeo] = useState(null);
  const [buildingObjects, setBuildingObjects] = useState([]);
  // const [buildings, setBuildings] = useState()

  useEffect(() => {
    getMapCoordinate(props.appEntity.id);
  }, [props.appEntity.id]);

  useEffect(() => {
    for (let i = 0; i < props.coordinateEntities.length; i++) {
      loadBuildingGeolocation(props.buildingEntities[i]);
    }
  }, [props.coordinateEntities]);

  function loadBuildingGeolocation(buildingEntity) {
    // axios.get('http://128.195.53.189:4001/api/entity/geo/get/' + entityId)

    // TODO: Here you need to update the building objects array to contain the building entity information + the geolocation information
    setBuildingObjects([
      ...buildingObjects,
      buildBuildingObject(
        buildingEntity,
        {
          resultCode: 191,
          message: "Found space geo object",
          geo: {
            extent: {
              extentClassId: 3,
              start: {
                latitude: 33.642992,
                longitude: -117.8422864
              },
              extentClassName: "rectangle",
              end: {
                latitude: 33.6435452,
                longitude: -117.8414719
              }
            },
            parentSpaceId: 2,
            coordinateSystem: {
              coordinateSystemClassName: "coordinateSystem2hfd",
              range: {
                yMin: 0,
                yMax: 1000,
                floorMin: 1,
                xMax: 1000,
                floorMax: 6,
                xMin: 0
              },
              coordinateSystemClassId: 3
            }
          }
        }.geo
      )
    ]);
  }

  // Build a building object that can be used throughout the entire application
  // This process should likely change as we should use entity id's throughout the entire app
  // But it's a lot easier to understand throughout our app if we refer to buildings
  // As a simple object with the provided schema in globals/test-data/uci-map.js
  function buildBuildingObject(buildingEntity, buildingGeo) {
    buildingEntity["geo"] = buildingGeo;
    // TODO: Change this to use floor range
    buildingEntity.floorCount = buildingGeo.coordinateSystem.range.floorMax;
    // TODO: Change building ID to just be id throughout the app
    buildingEntity.buildingId = buildingEntity.id;
    buildingEntity.occupancy = Math.floor(Math.random() * 100);
    buildingEntity.description = "Building in " + props.appEntity.name;
    buildingEntity.coordinates = buildCoordinates(buildingGeo.extent);

    return buildingEntity;
  }

  function getMapCoordinate(entityId) {
    setAppGeo(
      {
        resultCode: 191,
        message: "Found space geo object",
        geo: {
          extent: {
            extentClassId: 3,
            start: {
              latitude: 33.642992,
              longitude: -117.8422864
            },
            extentClassName: "rectangle",
            end: {
              latitude: 33.6435452,
              longitude: -117.8414719
            }
          },
          parentSpaceId: 1,
          coordinateSystem: {
            coordinateSystemClassName: "coordinateSystemGps",
            coordinateSystemClassId: 1
          }
        }
      }.geo
    );
  }

  function buildCoordinates(buildingGeo) {
    axios.get(
      "http://128.195.53.189:4001/api/observation/search?obsTypeId=2&orderBy=id&direction=asc&orderBy2=id&direction2=asc&limit=25",
      {
        params: {
          payload: {
            entityId: 4
          }
        }
      }
    );

    let coordinates = [];
    coordinates.push([buildingGeo.start.latitude, buildingGeo.start.longitude]);
    coordinates.push([buildingGeo.start.latitude, buildingGeo.end.longitude]);
    coordinates.push([buildingGeo.end.latitude, buildingGeo.end.longitude]);
    coordinates.push([buildingGeo.end.latitude, buildingGeo.start.longitude]);
    return coordinates;
  }

  return appGeo !== null ? (
    <Map
      center={[appGeo.extent.start.latitude, appGeo.extent.start.longitude]}
      style={{
        width: "100vw",
        height: "calc(100vh - 64px)",
        position: "fixed"
      }}
      className="CoordinateMap"
      zoom={15}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <span>
            A pretty CSS3 popup. <br /> Easily customizable.
          </span>
        </Popup>
      </Marker>
      {/* {uciMap.buildings.map(function(building, index) {
          return (
            <Polygon 
              key={index}
              onClick={() => props.selectBuilding(building)}
              positions={building.coordinates}
              color={'#' + blueRainbow.colorAt(building.occupancy)}
            >
              <Tooltip 
                sticky
                className="polygon-tooltip box-shadow"
                >{building.name + ' - ' + building.occupancy}
              </Tooltip>
            </Polygon>
          );
        })} */}
      {buildingObjects.map(function(buildingObject, index) {
        return (
          <Polygon
            key={index}
            onClick={() => props.selectBuilding(buildingObject)}
            positions={buildingObject.coordinates}
            color={"#" + blueRainbow.colorAt(buildingObject.occupancy)}
          >
            <Tooltip sticky className="polygon-tooltip box-shadow">
              {buildingObject.name}
            </Tooltip>
          </Polygon>
        );
      })}
    </Map>
  ) : null;
}

export default CoordinateMap;
