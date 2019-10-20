import React, { useState } from "react";
import './Home.scss';

import 'leaflet/dist/leaflet.css';
import Fade from 'react-reveal/Fade'
import { Trail } from 'react-spring/renderprops';
import { DatePicker, Button } from 'react-rainbow-components';

import {
  Card,
  Dialog
} from 'app/containers';

import {
  Legend,
  CoordinateMap,
  FloorRow
} from 'app/components';

function Home() {
  const [showDialog, setShowDialog] = useState(false);
  const [building, setBuilding] = useState(null);

  const items = [
    1,2,3,4,5,6
  ]

  function selectBuilding(building) {
    setBuilding(null);
    setBuilding(building);
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
        <Fade duration={1500} cascade>
          <div>
              <h1> UCI Campus </h1>
              <h2> Map Information </h2>
              <h3> Legend </h3>
              <Legend/>
              <h3> Timeline </h3>
              <DatePicker></DatePicker>
              <h2> Selected Building </h2>
              <div className="selected-building-info">
                { building !== null ?
                  <Trail
                    items={[...Array(building.floorCount).keys()]}
                    keys={item => item} 
                    from={{opacity: 0}} 
                    to={{opacity: 1}}
                    duration={4000}
                  >
                    {item => props => 
                      <FloorRow style={props} floorNumber={item}></FloorRow>
                    }
                  </Trail> 
                  : 
                    <p> No building selected</p>
                }
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
