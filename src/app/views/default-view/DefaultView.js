import React from "react";
import "./DefaultView.scss";
import { OccupancyButton } from "app/components";
import { TutorialCard } from "app/containers";

import tutorialFloorplan from "assets/images/tutorial-floorplan.png";
import tutorialMap from "assets/images/tutorial-map.png";

function redirectLoginOrSignup(login) {
  if (login) {
    window.location.href = `${process.env.PUBLIC_URL}/login`;
  } else {
    window.location.href = `${process.env.PUBLIC_URL}/signup`;
  }
}

function DefaultView() {
  return (
    <div className="DefaultView">
      <div className="block">
        <h1>Welcome to the TIPPERS Occupancy Tool!</h1>
        <div>Please login or signup with your TIPPERS account to continue:</div>
        <OccupancyButton
          isColored={true}
          style={{ marginTop: "32px" }}
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
        <div style={{ width: "32px" }} />
        <TutorialCard
          img={tutorialFloorplan}
          title={"2D Floorplans"}
          text={
            "Explore floorplans of buildings with live analytics for each room"
          }
        />
      </div>
    </div>
  );
}

export default DefaultView;
