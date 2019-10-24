import React from "react";
import './RealTimeGeo.scss';

import { 
  NumberFocus
} from 'app/containers';

function RealTimeGeo() {
  return (
    <div className="RealTimeGeo">
      <h2>
        Data
      </h2>
      <NumberFocus subtitle="Total Occupants"> 
        57
      </NumberFocus>
    </div>
  );
}

export default RealTimeGeo;
