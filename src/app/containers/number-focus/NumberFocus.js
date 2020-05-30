import React from "react";
import './NumberFocus.scss';

import moment from 'moment'

function NumberFocus(props) {
  return (
    <div className="NumberFocus flex-center" style={{...props.style}}>
      <div className="number-focus-number">
        {props.children}
      </div>
      <p className="number-focus-subtitle">
        {props.subtitle}
      </p>
      {
        (props.lastUpdated !== null && props.lastUpdated !== undefined) && props.lastUpdated !== 0 ?
        <p className="number-focus-last-updated">
          On {moment(props.lastUpdated).format("MMMM Do YYYY, h:mm a")}
        </p>
        : null
      }
    </div>
  );
}

export default NumberFocus;
