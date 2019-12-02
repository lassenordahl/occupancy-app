import React, { useState }  from "react";
import './GlobalInformation.scss';

import { Button, DatePicker, CheckboxToggle } from 'react-rainbow-components';

import { 
  NumberFocus
} from 'app/containers';

function GlobalInformation(props) {

  const [realtime, setRealtime] = useState(false);
  const [fromDate] = useState(new Date());
  const [toDate] = useState(new Date());

  return (
    <div className="GlobalInformation">
      <div className="header-toggle">
        <h2>Date Range</h2>
        <CheckboxToggle
          value={realtime}
          onChange={(event) => setRealtime(!realtime)}
        />
      </div>  
      <DatePicker
        label="from"
        value={fromDate}
        disabled={!realtime}
      />
      <div style={{'height': '16px'}}/>
      <DatePicker
        label="to"
        value={toDate}
        disabled={!realtime}
      />
      <div style={{'height': '24px'}}/>
      <h2>Campus Description</h2>
      <p>
        The University of California, Irvine is a public research university located in Irvine, California. It is one of the 10 campuses in the University of California system. UC Irvine offers 87 undergraduate degrees and 129 graduate and professional degrees.
      </p>
      <h2>
        Global Occupancy
      </h2>
      <NumberFocus subtitle={realtime ? "Average Occupants" : "Total Occupants"}>
        {!realtime ? 42 : 81.1}
      </NumberFocus>
      <Button
        variant="brand"
        label="Global Data"
        className="box-shadow color-blue"
        style={{'marginTop': 'auto', 'alignSelf': 'center'}}
        onClick={() => props.openDialog('global', 'Global', 'Detailed global view')}
      >
      </Button>
    </div>
  );
}

export default GlobalInformation;
