import React from "react";
import './Tooltip.scss';

import ReactTooltip from "react-tooltip";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestionCircle } from "@fortawesome/free-solid-svg-icons";

function Tooltip(props) {

  let randomId = Math.floor(Math.random() * 1000000).toString();

  return (
    <React.Fragment>
      <FontAwesomeIcon data-tip data-for={randomId} className="tooltip" icon={faQuestionCircle}></FontAwesomeIcon>
      <ReactTooltip id={randomId} className="tooltip-theme">
        <p>{props.text}</p>
      </ReactTooltip>
    </React.Fragment>
  );
}

export default Tooltip;
