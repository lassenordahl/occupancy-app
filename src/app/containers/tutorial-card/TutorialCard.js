import React from "react";
import './TutorialCard.scss';

function TutorialCard(props) {
  return (
    <div className="TutorialCard box-shadow">
        <img 
          className="tutorial-card-image"
          src={props.img}
          alt="Tutorial Card"
        />
        <h2>
          {props.title}
        </h2>
        <p>
          {props.text}
        </p>
    </div>
  );
}

export default TutorialCard;
