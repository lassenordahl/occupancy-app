import React from "react";
import './Card.scss';

function Card(props) {

  console.log(props.style);

  return (
    <div 
      className={`Card box-shadow ${props.className}`}
      style={{...props.style}}>
      {props.children}
    </div>
  );
}

export default Card;
