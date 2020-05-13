import React, { useEffect } from "react";
import "./CoordinateMap.scss";

import { Map, TileLayer, Marker, Popup, Polygon, Tooltip } from "react-leaflet";
import getBlueRainbow from "globals/utils/rainbowvis-helper.js";

const state = {
  lat: 33.6405,
  lng: -117.8443,
  zoom: 13,
};

const position = [state.lat, state.lng];

function CoordinateMap(props) {
  let blueRainbow = getBlueRainbow(props.legendMax);

  // Gets the coordinates for the center of the map so we can always center in on an object
  function getMapCenter() {
    // Obvious comment here!
    if (props.entity === null || props.entity === undefined) {
      return position;
    }

    let extent = props.entity.payload.geo.extent;

    // If we're using a polygon, we can calculate it by finding the minimum and maximum coordinate index
    // If we're using a rectangle, easy peasy lemon squeezy we can just divide them by two
    if (extent.extentClassName === "polygon") {
      let coordinates = extent.verticies.map(function (verticie) {
        return verticie.latitude + verticie.longitude;
      });

      const indexOfMax = coordinates.indexOf(Math.max(...coordinates));
      const indexOfMin = coordinates.indexOf(Math.min(...coordinates));

      return [
        (extent.verticies[indexOfMax].latitude +
          extent.verticies[indexOfMin].latitude) /
          2,
        (extent.verticies[indexOfMax].longitude +
          extent.verticies[indexOfMin].longitude) /
          2,
      ];
    } else if (extent.extentClassName === "rectangle") {
      return [
        (extent.start.latitude + extent.end.latitude) / 2,
        (extent.start.longitude + extent.end.longitude) / 2,
      ];
    }

    // Return default
    return position;
  }

  // Get how far we should be zoomed into the map, numbers are kinda arbitrary and just apply to the leaflet instance
  function getZoom() {
    if (props.entity === null || props.entity === undefined) {
      return 15;
    }

    let extent = props.entity.payload.geo.extent;
    let distance;

    // For a polygon, we can just say the difference is the min and max, similar to the code in the above function
    if (extent.extentClassName === "polygon") {
      let coordinates = extent.verticies.map(function (verticie) {
        return verticie.latitude + verticie.longitude;
      });

      const indexOfMax = coordinates.indexOf(Math.max(...coordinates));
      const indexOfMin = coordinates.indexOf(Math.min(...coordinates));

      distance = Math.abs(
        extent.verticies[indexOfMax].latitude -
          extent.verticies[indexOfMin].latitude
      );
    } else if (extent.extentClassName === "rectangle") {
      distance = Math.abs(extent.start.latitude - extent.end.latitude);
    } else {
      distance = -1;
    }

    // Arbitrary zoom levels based on testing
    // TODO: fine tune this more
    if (distance === -1) {
      return 15;
    } else if (distance > 0.0004) {
      return 16;
    } else {
      return 18;
    }
  }

  // Maps the coordinates coming in from the TIPPERS Api to the format that leaflet can graph
  function mapCoordinates(coordinateEntity) {
     if (coordinateEntity.payload === undefined) {
      return [];
    }

    let extent = coordinateEntity.payload.geo.extent;

    if (coordinateEntity === 10059) {
      console.log(coordinateEntity);
    }

    // Coordinate structure is different depending on if it's a polygon or a rectangle, but pretty simple nonetheless
    if (extent !== null) {
      if (extent.extentClassName === "polygon") {
        return extent.verticies.map(function (verticie) {
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
    }
    return [];
  }

  // Filter out invalid values for the coordinatesm this can help solve some issues with invalid data coming from the API
  // TODO: Might not be necessary anymore? I can't remember
  function mapCoordinateWrapper(coordinateEntity) {
    return mapCoordinates(coordinateEntity).filter(function (coordinate) {
      return !isNaN(coordinate[0]) && !isNaN(coordinate[1]);
    });
  }

  // Renders the polygons on the react leaflet instance
  function renderPolygons() {
    // If we're in GPS mode, we need to render a list of coordinate entities that has been passed down from the main entity
    // These are all children of a larger "space", say UCI's campus
    // If we're not in GPS mode, say cartesian2hfd, we can zoom in on the single entity that is being loaded by the application

    if (props.entityType === "gps") {
      return props.coordinateEntities.map(function (coordinateEntity, index) {
        let occupancy = getOccupancy(index);
        console.log(occupancy);
        return (
          <Polygon
            key={index}
            onClick={() => {
              if (coordinateEntity.id !== props.entity.id) {
                props.selectEntity(coordinateEntity);
              }
            }}
            positions={mapCoordinateWrapper(coordinateEntity)}
            color={occupancy === -1 ? "#808080" : "#" + blueRainbow.colorAt(occupancy || 0)}
          >
            <Tooltip sticky className="polygon-tooltip box-shadow">
              {coordinateEntity.name} - {occupancy === - 1 ? "No Data Available" : occupancy}
            </Tooltip>
          </Polygon>
        );
      });
    } else if (props.entityType === "cartesian2hfd") {
      return (
        <Polygon
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

  // Gets the occupancy for the given value
  function getOccupancy(index) {
    return props.occupancies[index] === undefined
      ? -1
      : props.occupancies[index].occupancy;
  }

  // Need to use the entity type from the props variable, because props.entityType isn't loaded yet
  let entityType =
    props.entity !== null && props.entity.payload.geo.coordinateSystem !== null
      ? props.entity.payload.geo.coordinateSystem.coordinateSystemClassName
      : "";

  return props.entity !== null &&
    (entityType === "gps" || entityType === "cartesian2hfd") ? (
    <Map
      center={getMapCenter()}
      style={{
        width: "100vw",
        height: "calc(100vh - 64px)",
        position: "fixed",
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
