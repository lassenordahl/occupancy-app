import React from "react";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

import moment from "moment";
import { Line } from "react-chartjs-2";
import Slider from "rc-slider";
import _ from "lodash";

import { Card, NumberFocus } from "app/containers";
import { SkeletonPulse } from "app/components";
import { useQueryParams } from "globals/hooks";
import {
  getChartJSOptions,
} from "globals/utils/chartjs-helper";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

function OccupancyCard(props) {

  let queryParams = useQueryParams();
  
  // Used for formatting dates
  function formatDateTime(datetime) {
    return moment(datetime).format("MMM Do h:mm A");
  }

  return (
    <Card
        className={
          "dialog-graph-info" +
          (!props.entityDataAvailable ? " disable-display-graph" : "")
        }
      >
        {props.entityDataAvailable ? (
          <React.Fragment>
            <div className="div1">
              <div>
                <div className="div1-title">
                  <h2>Occupancy Data</h2>
                  <h3>
                    {formatDateTime(queryParams.fromDate)} to{" "}
                    {formatDateTime(queryParams.toDate)}
                  </h3>
                </div>
                <div style={{ height: "16px" }} />
                {props.entityOccupantData.length > 0 ? (
                  <Line
                    data={props.processData()}
                    options={getChartJSOptions()}
                  ></Line>
                ) : (
                  <SkeletonPulse style={{ width: "100%", height: "320px" }} />
                )}
                <h2>Timeline</h2>
                <div style={{ height: "16px" }} />
                {props.entityOccupantData.length > 0 ? (
                  <React.Fragment>
                    <div style={{ marginLeft: "48px", marginRight: "48px" }}>
                      <Range
                        min={0}
                        max={props.entityOccupantData[0].timestamps.length - 1}
                        defaultValue={[
                          0,
                          props.entityOccupantData[0].data.length - 1,
                        ]}
                        tipFormatter={(value) =>
                          `${formatDateTime(
                            props.entityOccupantData[0].timestamps[value]
                          )}`
                        }
                        trackStyle={[{ backgroundColor: "#2749c4" }]}
                        onChange={props.setTimelines}
                      />
                    </div>
                    <div className="range-labels">
                      <p>
                        {formatDateTime(props.entityOccupantData[0].timestamps[0])}
                      </p>
                      <p>
                        {formatDateTime(
                          props.entityOccupantData[0].timestamps[
                            props.entityOccupantData[0].timestamps.length - 1
                          ]
                        )}
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <SkeletonPulse
                    style={{
                      width: "100%",
                      height: "54px",
                      transform: "translateY(-16px)",
                    }}
                  />
                )}
              </div>
            </div>
            <div className="div2">
              <NumberFocus
                subtitle="Minimum"
                lastUpdated={props.min !== null ? props.min.timestamp : null}
              >
                {props.min !== null ? (
                  props.min.value
                ) : (
                  <SkeletonPulse
                    style={{
                      width: "50px",
                      height: "50px",
                      margin: "20px",
                    }}
                  />
                )}
              </NumberFocus>
            </div>
            <div className="div3">
              <NumberFocus subtitle="Average">
                {props.avg !== null ? (
                  props.avg
                ) : (
                  <SkeletonPulse
                    style={{
                      width: "50px",
                      height: "50px",
                      margin: "20px",
                    }}
                  />
                )}
              </NumberFocus>
            </div>
            <div className="div4">
              <NumberFocus
                subtitle="Maximum"
                lastUpdated={props.max !== null ? props.max.timestamp : null}
              >
                {props.max !== null ? (
                  props.max.value
                ) : (
                  <SkeletonPulse
                    style={{
                      width: "50px",
                      height: "50px",
                      margin: "20px",
                    }}
                  />
                )}
              </NumberFocus>
            </div>
          </React.Fragment>
        ) : (
          <div className="dialog-no-data-screen fade-in">
            <h3>No data available</h3>
            <p>(Maybe check your bounding date range!)</p>
          </div>
        )}
      </Card>
  );
}

export default OccupancyCard;
