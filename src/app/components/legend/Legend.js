import React from "react";
import "./Legend.scss";
import Fade from "react-reveal/Fade";

import LegendRow from "./legend-row/LegendRow";
import blueRainbow from "globals/utils/rainbowvis-helper.js";

const ranges = [
  {
    color: "#" + blueRainbow.colorAt(25),
    range: "0-20"
  },
  {
    color: "#" + blueRainbow.colorAt(50),
    range: "21-50"
  },
  {
    color: "#" + blueRainbow.colorAt(75),
    range: "51-100"
  },
  {
    color: "#" + blueRainbow.colorAt(100),
    range: "100+"
  }
];

function Legend() {
  return (
    <Fade duration={1500}>
      <div className="Legend">
        {ranges.map(function(row, index) {
          return (
            <LegendRow
              color={row.color}
              range={row.range}
              key={index}
            ></LegendRow>
          );
        })}
      </div>
    </Fade>
  );
}

export default Legend;
