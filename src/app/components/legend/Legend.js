import React, { useState } from "react";
import "./Legend.scss";

import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

import LegendRow from "./legend-row/LegendRow";
import getBlueRainbow from "globals/utils/rainbowvis-helper.js";
import { Card } from "app/containers";
import { SkeletonPulse } from "app/components";
import { useWindowDimensions } from "globals/hooks";

function Legend(props) {
  const { width, height } = useWindowDimensions();
  console.log(width);

  let blueRainbow = getBlueRainbow(props.legendMax);

  // Utilize different segmented colors for ranges in our app
  const ranges = [
    {
      color: "#808080",
      range: "No data",
    },
    {
      color: "#" + blueRainbow.colorAt(0.0),
      range: 0,
    },
    {
      color: "#" + blueRainbow.colorAt(Math.floor(props.legendMax * 0.5)),
      range: Math.floor(props.legendMax * 0.5),
    },
    {
      color: "#" + blueRainbow.colorAt(props.legendMax),
      range: props.legendMax,
    },
  ];

  return (
    <Card
      className={
        "slide-up-fade-in legend-card " +
        (props.transitionLegend ? "legend-card-none" : "")
      }
    >
      <Fade duration={1500}>
        <div className="Legend">
          {props.legendMax > 0
            ? ranges.map(function (row, index) {
                return (
                  <LegendRow
                    color={row.color}
                    range={row.range}
                    key={index}
                  ></LegendRow>
                );
              })
            : ranges.map(function (row, index) {
                return (
                  <SkeletonPulse
                    key={index}
                    style={{
                      height: "20px",
                      width: "100%",
                      borderRadius: "5px",
                    }}
                  />
                );
              })}
        </div>
      </Fade>
    </Card>
  );
}

export default Legend;
