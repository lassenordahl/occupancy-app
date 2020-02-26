import React, { useState, useEffect } from "react";
import "./CoordinateMap.scss";

import { Map, TileLayer, Marker, Popup, Polygon, Tooltip } from "react-leaflet";
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

  function renderPolygons() {
    if (props.entityType === "gps") {
      return props.coordinateEntities.map(function(coordinateEntity, index) {
        let occupancy = getOccupancy(index)
        return (
          <Polygon
            key={index}
            onClick={() => props.selectEntity(coordinateEntity)}
            positions={mapCoordinates(coordinateEntity)}
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
          positions={mapCoordinates(props.entity)}
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
      return props.occupancies[index];
    } else {
      return 0;
    }
  }

  function getMapCenter() {
    if (props.entity === null || props.entity === undefined) {
      return position;
    }

    let extent = props.entity.payload.geo.extent;
    if (extent.extentClassName === "polygon") {
      console.log([extent.verticies[0].latitude, extent.verticies[0].longitude]);
      return [extent.verticies[0].latitude, extent.verticies[0].longitude];
    }
    // } else if (extent.extentClassName === "rectangle") {
    // }
    return position;
  }

  function getZoom() {
    if (props.entityType === "gps") {
      return 15;
    } else {
      return 16;
    }
  }

  return props.entity !== null ? (
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
        url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"
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
