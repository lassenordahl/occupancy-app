import React from "react";
import './SkeletonPulse.scss';

function SkeletonPulse(props) {
  return (
    <div className="skeleton-pulse" style={props.style}/>
  );
}

export default SkeletonPulse;
