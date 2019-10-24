import React from "react";
import './RealTimeGeo.scss';

import { 
  NumberFocus
} from 'app/containers';

import {
  SelectedBuilding
} from 'app/components';

import { Button } from 'react-rainbow-components';

function RealTimeGeo(props) {
  return (
    <div className="RealTimeGeo">
      <h2>
        Global Map Data
      </h2>
      <NumberFocus subtitle="Total Occupants"> 
        57
      </NumberFocus>
      <h2>
        Selected Building
      </h2>
      <SelectedBuilding building={props.building}></SelectedBuilding>
      <Button
        variant="brand"
        className="box-shadow color-blue"
        style={{'marginTop': 'auto', 'alignSelf': 'center'}}
        onClick={() => props.setShowDialog(true)}
      >
        Show Map Data
      </Button>
    </div>
  );
}

export default RealTimeGeo;
