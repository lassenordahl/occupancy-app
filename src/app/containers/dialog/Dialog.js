import React from "react";
import './Dialog.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/free-solid-svg-icons'

import Card from './../card/Card';

function Dialog(props) {

  return (
    <Card 
      className={`fade-in Dialog box-shadow ${props.className}`}
      style={{...props.style, animationDuration: "0.5s"}}
    > 
      <div className="dialog-navbar">
        <div>
          <h1>
            {props.title}
          </h1>
          <h3>
            {props.titleSubscript}
          </h3>
        </div>
        <FontAwesomeIcon icon={faTimes} onClick={() => props.closeDialog()}></FontAwesomeIcon>
      </div>
      <div className="dialog-content">
        {props.children}
      </div>
    </Card>
  );
}

export default Dialog;
