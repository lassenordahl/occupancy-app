import React, { useState, useEffect } from "react";
import "./CoordinateMap.scss";

import { Map, TileLayer, Marker, Popup, Polygon, Tooltip } from "react-leaflet";
import getBlueRainbow from "globals/utils/rainbowvis-helper.js";
import axios from "axios";
import authGet from "../../../globals/authentication/AuthGet";

const state = {
  lat: 33.6405,
  lng: -117.8443,
  zoom: 13
};

const position = [state.lat, state.lng];

function CoordinateMap(props) {

  let blueRainbow = getBlueRainbow(props.legendMax);

  useEffect(() => {
    for (let i = 0; i < props.coordinateEntities.length; i++) {
      // loadBuildingGeolocation(props.coordinateEntities[i]);
    }
  }, [props.coordinateEntities]);

  function getMapCenter() {
    if (props.entity === null || props.entity === undefined) {
      return position;
    }
    let extent = props.entity.payload.geo.extent;
    if (extent.extentClassName === "polygon") {
      let coordinates = extent.verticies.map(function(verticie) {
        return verticie.latitude + verticie.longitude;
      });

      const indexOfMax = coordinates.indexOf(Math.max(...coordinates));
      const indexOfMin = coordinates.indexOf(Math.min(...coordinates));

      return ([
        (extent.verticies[indexOfMax].latitude + extent.verticies[indexOfMin].latitude) / 2,
        (extent.verticies[indexOfMax].longitude + extent.verticies[indexOfMin].longitude) / 2,
      ]);
    } else if (extent.extentClassName === "rectangle"){
      return ([
        (extent.start.latitude + extent.end.latitude) / 2,
        (extent.start.longitude + extent.end.longitude) / 2
      ]);
    }

    // Return default
    return position;
  }

  function getZoom() {
    if (props.entity === null || props.entity === undefined) {
      return 15;
    }

    let extent = props.entity.payload.geo.extent;
    let distance;

    if (extent.extentClassName === "polygon") {
      let coordinates = extent.verticies.map(function(verticie) {
        return verticie.latitude + verticie.longitude;
      });

      const indexOfMax = coordinates.indexOf(Math.max(...coordinates));
      const indexOfMin = coordinates.indexOf(Math.min(...coordinates));

      distance = Math.abs(extent.verticies[indexOfMax].latitude - extent.verticies[indexOfMin].latitude);
    } else if (extent.extentClassName === "rectangle"){
      distance = Math.abs(extent.start.latitude - extent.end.latitude);
    } else {
      distance = -1;
    }
    if (distance === -1) {
      return 15;
    } else if (distance > .0004)  {
      return 16;
    } else {
      return 18;
    }
  }

  function mapCoordinates(coordinateEntity) {
    if (coordinateEntity.payload === undefined) {
      return [];
    }

    let extent = coordinateEntity.payload.geo.extent;
    if (extent.extentClassName === "polygon") {
      return extent.verticies.map(function(verticie) {
        return [verticie.latitude, verticie.longitude];
      });
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

  function mapCoordinateWrapper(coordinateEntity) {
    return mapCoordinates(coordinateEntity).filter(function(coordinate) {
      return !isNaN(coordinate[0]) && !isNaN(coordinate[1]); 
    });
  }

  function renderPolygons() {
    if (props.entityType === "gps") {
      return props.coordinateEntities.map(function(coordinateEntity, index) {
        let occupancy = getOccupancy(index)
        return (
          <Polygon
            key={index}
            onClick={() => props.selectEntity(coordinateEntity)}
            positions={mapCoordinateWrapper(coordinateEntity)}
            color={"#" + blueRainbow.colorAt(occupancy)}
          >
            <Tooltip sticky className="polygon-tooltip box-shadow">
              {coordinateEntity.name} - {occupancy}
            </Tooltip>
          </Polygon>
        );
      });
    } else if (props.entityType === "cartesian2hfd") {
      return (
        <Polygon
          onClick={() => props.selectEntity(props.entity)}
          positions={mapCoordinateWrapper(props.entity)}
          color={"#" + blueRainbow.colorAt(10)}
        >
          <Tooltip sticky className="polygon-tooltip box-shadow">
            {props.entity.name}
          </Tooltip>
        </Polygon>
      );
    }
    return null;
  }

  function getOccupancy(index) {
    if (props.occupancies[index] !== undefined) {
      return props.occupancies[index].payload === undefined ? 0 : props.occupancies[index].payload.value;
    } else {
      return 0;
    }
  }

  // Need to use the entity type from the props variable, because props.entityType isn't loaded yet
  let entityType = props.entity !== null ? props.entity.payload.geo.coordinateSystem.coordinateSystemClassName : "";

  return props.entity !== null && (entityType === "gps" || entityType === "cartesian2hfd") ? (
    <Map
      center={getMapCenter()}
      style={{
        width: "100vw",
        height: "calc(100vh - 64px)",
        position: "fixed"
      }}
      className="CoordinateMap"
      zoom={getZoom()}
    >
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png"
      />
      <Marker position={position}>
        <Popup>
          <span>
            A pretty CSS3 popup. <br /> Easily customizable.
          </span>
        </Popup>
      </Marker>
      {renderPolygons()}
    </Map>
  ) : null;
}

export default CoordinateMap;
