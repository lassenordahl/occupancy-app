import React from "react";
import "./DefaultView.scss";
import { Button } from 'react-rainbow-components';
import { OccupancyButton } from "app/components";
import { TutorialCard } from "app/containers";

import tutorialFloorplan from "assets/images/tutorial-floorplan.png";
import tutorialMap from "assets/images/tutorial-map.png";


function redirectLoginOrSignup(login) {
  if (login) {
    window.location.href = '/login'; 
  }
  else {
    window.location.href = '/signup'; 
  }
}

function DefaultView() {
  return (
    <div class="DefaultView">
      <div class="block">
        <h1>Welcome to the TIPPERS Occupancy Tool!</h1>
        <div>Please login or signup with your TIPPERS account to continue:</div>
        <OccupancyButton
          isColored={true}
          style={{marginTop: '32px'}}
          onClick={() => redirectLoginOrSignup(true)}
          label="Login with TIPPERS"
        />
      </div>
      <div className="tutorial-wrapper">
        <TutorialCard
          img={tutorialMap}
          title={"Coordinate Maps"}
          text={"View maps of entity spaces and their respective occupancies"}
        />
        <TutorialCard
          img={tutorialFloorplan}
          title={"2D Floorplans"}
          text={"Explore floorplans of buildings with live analytics for each room"}
        />
      </div>
    </div>
  );
}

export default DefaultView;
