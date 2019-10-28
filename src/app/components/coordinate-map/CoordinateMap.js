import React from "react";
import './CoordinateMap.scss';

import { Map, TileLayer, Marker, Popup, Polygon, Tooltip } from 'react-leaflet';
import uciMap from 'globals/test-data/uci-map.js';

const state = {
  lat: 33.6405,
  lng: -117.8443,
  zoom: 13,
}

const position = [ state.lat, state.lng ];

function CoordinateMap(props) {
  return (
    <Map center={[state.lat, state.lng]} 
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
      {uciMap.buildings.map(function(building) {
        return (
          <Polygon onClick={() => props.selectBuilding(building)}
            positions={building.coordinates}
          >
            <Tooltip 
              sticky
              className="polygon-tooltip box-shadow"
              >{building.name}
            </Tooltip>
          </Polygon>
        );
      })}
    </Map>
  );
}

export default CoordinateMap;
