import React, { useState } from "react";
import './Home.scss';

import 'leaflet/dist/leaflet.css';

import { Map, TileLayer } from 'react-leaflet';
import { Slider, DatePicker, Button } from 'react-rainbow-components';

import {
  Card,
} from 'app/containers';

import {
  Legend
} from 'app/components';

function Home() {
  const [value, setValue] = useState(50);

  function onChange(e) {
    setValue(e.target.value);
  }

  const state = {
    lat: 51.505,
    lng: -0.09,
    zoom: 13,
  }

  const position = [ state.lat, state.lng ];

  return (
    <div className="Home">
      {/* <Map style={{'width': '100vw', 'height': '100vh'}} position={[51.505, -0.09]} zoom={12}>
        <TileLayer
            attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="http://stamen-tiles-{s}.a.ssl.fastly.net/toner-background/{z}/{x}/{y}.png"
          />
      </Map> */}
      <Card className="information-card" style={{width: '400px'}}>
        <div>
          <h1>
            UCI Campus
          </h1>
          <h3>
            Legend
          </h3>
          <Legend/>
          <h3>
            Timeline
          </h3>
          <DatePicker></DatePicker>
          <h2>
            Selected Building
          </h2>
          <div className="selected-building-info flex-center">
            <p>No building selected</p>
          </div>
          <Button
            variant="brand"
            className="box-shadow color-blue"
            style={{'alignSelf': 'center'}}
          >
            Show Map Data
          </Button>
        </div>
      </Card>
    </div>
  );
}

export default Home;
