import React from "react";
import './CoordinateMap.scss';

import { Map, TileLayer, Marker, Popup, Polygon } from 'react-leaflet';

const state = {
  lat: 33.6405,
  lng: -117.8443,
  zoom: 13,
}

const position = [ state.lat, state.lng ];

function CoordinateMap() {
  return (
    <Map center={[state.lat, state.lng]} 
      style={{'width': '100vw', 'height': 'calc(100vh - 64px)', 'position': 'fixed'}}
      // className="map" 
      zoom={13}>
      <TileLayer
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
        url='http://{s}.tile.osm.org/{z}/{x}/{y}.png'
      />
      <Marker position={position}>
        <Popup>
          <span>A pretty CSS3 popup. <br/> Easily customizable.</span>
        </Popup>
      </Marker>
      <Polygon positions={[
        [33.647015, -117.841485],
        [33.646819, -117.841174],
        [33.647232, -117.840693],
        [33.647498, -117.841088]
      ]}></Polygon>
    </Map>
  );
}

export default CoordinateMap;
