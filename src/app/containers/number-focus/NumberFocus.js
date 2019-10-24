import React from "react";
import './NumberFocus.scss';

function NumberFocus(props) {
  return (
    <div className="NumberFocus flex-center">
      <p className="number-focus-number">
        {props.children}
      </p>
      <p className="number-focus-subtitle">
        {props.subtitle}
      </p>
    </div>
  );
}

export default NumberFocus;
