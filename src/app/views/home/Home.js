import React, { useState } from "react";
import './Home.scss';

import 'leaflet/dist/leaflet.css';
import Fade from 'react-reveal/Fade'
import { Trail } from 'react-spring/renderprops';
import { Map, TileLayer, Marker, Popup } from 'react-leaflet';
import { DatePicker, Button } from 'react-rainbow-components';

import {
  Card,
  Dialog
} from 'app/containers';

import {
  Legend
} from 'app/components';

function Home() {
  const [value, setValue] = useState(50);
  const [showDialog, setShowDialog] = useState(false);

  function onChange(e) {
    setValue(e.target.value);
  }

  const state = {
    lat: 33.6405,
    lng: -117.8443,
    zoom: 13,
  }

  const position = [ state.lat, state.lng ];

  const items = [
    1,2,3,4
  ]

  return (
    <div className="Home">
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
      </Map>
      {showDialog ?
        <Dialog 
          className="dialog" 
          closeDialog={() => setShowDialog(false)}
          title="Hay Baby"
        >
            <div className="dialog-test-content">
              <Trail 
                items={items} 
                keys={item => item} 
                from={{opacity: 0}} 
                to={{opacity: 1}}
                duration={3000}
              >
                {item => props => 
                  <Card className="flex-center" style={props}>
                    <h1>
                      {item}    
                    </h1>
                  </Card>
                }
              </Trail>
            </div>
        </Dialog>
      : null}
      <Card className="information-card" style={{width: '400px'}}>
        <Fade duration={1500} cascade>
          <div>
              <h1>
                UCI Campus
              </h1>
              <h2>
                Map Information
              </h2>
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
                onClick={() => setShowDialog(true)}
              >
                Show Map Data
              </Button>
          </div>
        </Fade>
      </Card>
    </div>
  );
}

export default Home;
