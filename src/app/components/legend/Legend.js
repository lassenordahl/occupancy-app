import React from "react";
import "./Legend.scss";

import Fade from "react-reveal/Fade";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faCaretUp } from "@fortawesome/free-solid-svg-icons";

import LegendRow from "./legend-row/LegendRow";
import getBlueRainbow from "globals/utils/rainbowvis-helper.js";
import { Card } from "app/containers";
import { SkeletonPulse } from "app/components";

function Legend(props) {
  let blueRainbow = getBlueRainbow(props.legendMax);

  // Utilize different segmented colors for ranges in our app
  const ranges = [
    {
      color: "#" + blueRainbow.colorAt(Math.floor(props.legendMax * 0.25)),
      range: Math.floor(props.legendMax * 0.25),
    },
    {
      color: "#" + blueRainbow.colorAt(Math.floor(props.legendMax * 0.5)),
      range: Math.floor(props.legendMax * 0.5),
    },
    {
      color: "#" + blueRainbow.colorAt(Math.floor(props.legendMax * 0.75)),
      range: Math.floor(props.legendMax * 0.75),
    },
    {
      color: "#" + blueRainbow.colorAt(props.legendMax),
      range: props.legendMax,
    },
  ];

  return (
    <Card
      className={
        "fade-in legend-card " +
        (props.transitionLegend ? "legend-card-none" : "")
      }
      style={{ width: "240px" }}
    >
      <div
        className={
          "legend-header " +
          (props.transitionLegend ? "legend-header-margin" : "")
        }
      >
        <h2 style={{ marginBottom: "0px", fontSize: "1.8em" }}>Legend</h2>
        {props.showLegend ? (
          <FontAwesomeIcon
            icon={faCaretDown}
            onClick={function () {
              props.setShowLegend(false);
              setTimeout(() => {
                props.setTransitionLegend(true);
              }, 200);
            }}
          ></FontAwesomeIcon>
        ) : (
          <FontAwesomeIcon
            icon={faCaretUp}
            onClick={function () {
              props.setTransitionLegend(false);
              setTimeout(() => {
                props.setShowLegend(true);
              }, 500);
            }}
          ></FontAwesomeIcon>
        )}
      </div>
      <div
        className={
          "legend-content " + (props.showLegend ? "" : "legend-content-none")
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
                        width: "78%",
                        marginBottom: (index < ranges.length - 1 ? "20px" : "0px"),
                        borderRadius: "5px",
                      }}
                    />
                  );
                })}
          </div>
        </Fade>
      </div>
    </Card>
  );
}

export default Legend;
