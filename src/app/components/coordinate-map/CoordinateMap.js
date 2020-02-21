import React, { useState, useEffect } from "react";
import "./CoordinateMap.scss";

import { Map, TileLayer, Marker, Popup, Polygon, Tooltip } from "react-leaflet";
import uciMap from "globals/test-data/uci-map.js";
import blueRainbow from "globals/utils/rainbowvis-helper.js";
import axios from "axios";
import authGet from "../../../globals/authentication/AuthGet";

const state = {
  lat: 33.6405,
  lng: -117.8443,
  zoom: 13
};

const position = [state.lat, state.lng];

function CoordinateMap(props) {
  useEffect(() => {
    for (let i = 0; i < props.coordinateEntities.length; i++) {
      // loadBuildingGeolocation(props.coordinateEntities[i]);
    }
  }, [props.coordinateEntities]);

  function buildCoordinates(buildingGeo) {
    authGet(
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

  function mapCoordinates(coordinateEntity) {
    let extent = coordinateEntity.payload.geo.extent;
    if (extent.extentClassName === "polygon") {
      return extent.verticies.map(function(verticie) {
        return [verticie.latitude, verticie.longitude];
      })
    } else if (extent.extentClassName === "rectangle") {
      let coordinates = [];
      if (extent.start.latitude === undefined) {
        return [];
      }
      coordinates.push([extent.start.latitude, extent.start.longitude]);
      coordinates.push([extent.start.latitude, extent.end.longitude]);
      coordinates.push([extent.end.latitude, extent.end.longitude]);
      coordinates.push([extent.end.latitude, extent.start.longitude]);
      return coordinates;
    }
    return [];
  }

  function renderPolygons() {
    
    if (props.entityType === "gps") {
      return props.coordinateEntities.map(function(coordinateEntity, index) {
        return (
          <Polygon
            key={index}
            onClick={() => props.selectEntity(coordinateEntity)}
            positions={mapCoordinates(coordinateEntity)}
            color={"#" + blueRainbow.colorAt(10)}
          >
            <Tooltip sticky className="polygon-tooltip box-shadow">
              {coordinateEntity.name}
            </Tooltip>
          </Polygon>
        );
      });
    }
    return null;
  }

  return props.entity !== null ? (
    <Map
      center={[33, 33]}
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
      {renderPolygons()}
    </Map>
  ) : null;
}

export default CoordinateMap;
