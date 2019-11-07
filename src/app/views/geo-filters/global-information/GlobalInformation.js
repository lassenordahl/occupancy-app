import React from "react";
import './GlobalInformation.scss';

import { Button, DatePicker } from 'react-rainbow-components';

import { 
  NumberFocus
} from 'app/containers';

function GlobalInformation() {
  return (
    <div className="GlobalInformation">
      <h2>
        Date Filtering
      </h2>
      <DatePicker
        label="from"
      />
      <div style={{'height': '16px'}}/>
      <DatePicker
        label="to"
      />
      <div style={{'height': '24px'}}/>
      <h2>
        Campus Description
      </h2>
      <p>
        The University of California, Irvine is a public research university located in Irvine, California. It is one of the 10 campuses in the University of California system. UC Irvine offers 87 undergraduate degrees and 129 graduate and professional degrees.
      </p>
      <h2>
        Global Occupancy
      </h2>
      <NumberFocus subtitle="Total Occupants">
        42
      </NumberFocus>
      <Button
        variant="brand"
        className="box-shadow color-blue"
        style={{'marginTop': 'auto', 'alignSelf': 'center'}}
      >
        Map Data
      </Button>
    </div>
  );
}

export default GlobalInformation;
