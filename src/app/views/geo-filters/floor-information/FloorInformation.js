import React from "react";
import './FloorInformation.scss';

import { Button } from 'react-rainbow-components';

function FloorInformation(props) {

  return (
    <div className="FloorInformation">
      <h2>
        Floor Selection
      </h2>
      <p>
        You have selected a floor
      </p>
      <div style={{height: '16px'}}></div>
      <h2>
        Floor Information
      </h2>
      <p>
        DBH 2059 serves as the meeting hub for all IoT research. Students and Post-doc researchers work here to develop IoT applications.
      </p>

      <Button
        variant="brand"
        className="box-shadow color-blue"
        style={{'marginTop': 'auto', 'alignSelf': 'center'}}
        onClick={() => props.openDialog('floor', 'Floor', 'Detailed floor view')}
        label="Floor Data"
      >
      </Button>
    </div>
  );
}

export default FloorInformation;
