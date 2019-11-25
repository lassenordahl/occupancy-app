import React, { useState, useEffect } from "react";
import './CoordinateMap.scss';

import { Map, TileLayer, Marker, Popup, Polygon, Tooltip } from 'react-leaflet';
import uciMap from 'globals/test-data/uci-map.js';
import blueRainbow from 'globals/rainbowvis-helper.js';

const state = {
  lat: 33.6405,
  lng: -117.8443,
  zoom: 13,
}

const position = [ state.lat, state.lng ];

function CoordinateMap(props) {

  const [appGeo, setAppGeo] = useState(null);

  useEffect(() => {
    getMapCoordinate(props.appEntity.id);
  }, [props.appEntity.id]);

  function getMapCoordinate(entityId) {
    setAppGeo({
      "resultCode": 191,
      "message": "Found space geo object",
      "geo": {
        "extent": {
          "extentClassId": 3,
          "start": {
            "latitude": 33.642992,
            "longitude": -117.8422864
          },
          "extentClassName": "rectangle",
          "end": {
            "latitude": 33.6435452,
            "longitude": -117.8414719
          }
        },
        "parentSpaceId": 1,
        "coordinateSystem": {
          "coordinateSystemClassName": "coordinateSystemGps",
          "coordinateSystemClassId": 1
        }
      }
    }.geo);
  }

  return (
    appGeo !== null ?
      <Map center={[appGeo.extent.start.latitude, appGeo.extent.start.longitude]} 
        style={{'width': '100vw', 'height': 'calc(100vh - 64px)', 'position': 'fixed'}}
        className="CoordinateMap" 
        zoom={15}>
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
        />
        <Marker position={position}>
          <Popup>
            <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
          </Popup>
        </Marker>
        {uciMap.buildings.map(function(building, index) {
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
        })}
      </Map>
      : null
  );
}

export default CoordinateMap;
