import React from "react";
import "./Legend.scss";
import Fade from "react-reveal/Fade";

import LegendRow from "./legend-row/LegendRow";
import getBlueRainbow from "globals/utils/rainbowvis-helper.js";

function Legend(props) {

  let blueRainbow = getBlueRainbow(props.legendMax);

  // Utilize different segmented colors for ranges in our app
  const ranges = [
    {
      color: "#" + blueRainbow.colorAt(Math.floor(props.legendMax * .25)),
      range: Math.floor(props.legendMax * .25)
    },
    {
      color: "#" + blueRainbow.colorAt(Math.floor(props.legendMax * .5)),
      range: Math.floor(props.legendMax * .5)
    },
    {
      color: "#" + blueRainbow.colorAt(Math.floor(props.legendMax * .75)),
      range: Math.floor(props.legendMax * .75)
    },
    {
      color: "#" + blueRainbow.colorAt(props.legendMax),
      range: props.legendMax
    }
  ];

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
