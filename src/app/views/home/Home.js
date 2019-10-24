import React, { useState } from "react";
import './Home.scss';

import 'leaflet/dist/leaflet.css';
import Fade from 'react-reveal/Fade'
import { Trail } from 'react-spring/renderprops';
import { Button, Tabset, Tab } from 'react-rainbow-components';

import {
  Card,
  Dialog
} from 'app/containers';

import {
  Legend,
  CoordinateMap,
  FloorRow
} from 'app/components';

import { 
  HistoricalGeo,
  RealTimeGeo
} from 'app/views';

function Home() {
  const [showDialog, setShowDialog] = useState(false);
  const [building, setBuilding] = useState(null);
  const [selectedTab, setSelectedTab]  = useState("real-time");

  const items = [
    1,2,3,4,5,6
  ]

  function selectBuilding(building) {
    setBuilding(null);
    setBuilding(building);
  }

  function handleOnSelect(event, selected) {
    setSelectedTab(selected);
  }

  return (
    <div className="Home">
      <CoordinateMap selectBuilding={selectBuilding}></CoordinateMap>
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
                duration={4000}
              >
                {item => props => 
                  <Card className="flex-center test" style={props}>
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
        <div className="information-header">
          <h1>
            UCI Campus
          </h1>
        </div>
        
        <Tabset
          onSelect={handleOnSelect}
          activeTabName={selectedTab}
        >
          <Tab
            label="REAL-TIME"
            name="real-time"
            id="real-time"
          >
          </Tab>
          <Tab
            label="HISTORICAL"
            name="historical"
            id="historical"
          >
          </Tab>
        </Tabset>
        <div className="information-tab-content">
          {selectedTab === 'real-time' ? 
            <RealTimeGeo 
              building={building}
            /> 
            : 
            <HistoricalGeo 
              building={building}
              setShowDialog={setShowDialog}
            />
          }
        </div>
      </Card>
    </div>
  );
}

export default Home;
