import React from "react";
import './NumberFocus.scss';

import moment from 'moment'

function NumberFocus(props) {
  return (
    <div className="NumberFocus flex-center" style={{...props.style}}>
      <p className="number-focus-number" style={{'marginBottom': 0}}>
        {props.children}
      </p>
      <p className="number-focus-subtitle">
        {props.subtitle}
      </p>
      {
        props.lastUpdated !== null ?
        <p className="number-focus-last-updated">
          Last Updated: {moment(props.lastUpdated).format("MMMM Do YYYY, h:mm:ss a")}
        </p>
        : null
      }
    </div>
  );
}

export default NumberFocus;
