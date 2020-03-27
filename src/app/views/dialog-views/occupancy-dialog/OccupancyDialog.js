import React, { useEffect, useState } from "react";
import "./OccupancyDialog.scss";

import axios from "axios";
import moment from "moment";
import { Line } from "react-chartjs-2";
import { Spinner } from "react-rainbow-components";

import { Card, NumberFocus } from "app/containers";

import {
  getChartJSData,
  getChartJSDataset,
  getChartJSOptions
} from "globals/utils/chartjs-helper.js";

import { DateTimePicker, CheckboxToggle } from "react-rainbow-components";

function OccupancyDialog(props) {
  const [showSpinner, setShowSpinner] = useState(true);
  const [observationValues, setObservationValues] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [avg, setAvg] = useState(0);
  const [projected, setProjected] = useState(false);

  const [projectedFromDate, setProjectedFromDate] = useState(new Date());
  const [projectedToDate, setProjectedToDate] = useState(new Date());

  useEffect(() => {
    setTimeout(() => {
      setShowSpinner(false);
    }, 1000);
  }, [showSpinner]);

  useEffect(() => {
    if (props.entityId !== null) {
      getOccupancyInformation(props.entityId);
    }
  }, [props.entityId]);

  useEffect(() => {
    if (observationValues !== null) {
      mapObservationValues();
    }
  }, [observationValues]);

  function mapObservationValues() {
    let maxVal = Number.MIN_SAFE_INTEGER;
    let minVal = Number.MAX_SAFE_INTEGER;
    let total = 0;
    let data = observationValues.map(function(observation) {
      total += observation.payload.value;
      if (observation.payload.value > maxVal) {
        maxVal = observation.payload.value;
      }
      if (observation.payload.value < minVal) {
        minVal = observation.payload.value;
      }
      return observation.payload.value;
    });

    let timestamps = observationValues.map(function(observation) {
      return moment(observation.timestamp).format("MM-DD hh:mm:ss");
    });

    setMax(maxVal);
    setMin(minVal);
    setAvg((total / observationValues.length).toFixed(1));

    setOccupancyData({
      data: data,
      timestamps: timestamps
    });
  }

  function getOccupancyInformation(entityId) {
    // axios.get('http://128.195.53.189:4001/api/observation/search?obsTypeId=3&orderBy=id&direction=asc&orderBy2=id&direction2=asc&limit=25',
    //   {
    //     params : {
    //       entityId: entityId
    //     }
    //   })
    //   .then(function (response) {

    //   })
    //   .catch(function(error) {

    //   });
    setObservationValues(
      {
        resultCode: 400,
        message: "Values found with search parameters.",
        values: [
          {
            id: 6,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 100
            },
            deviceId: 2
          },
          {
            id: 7,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 100
            },
            deviceId: 2
          },
          {
            id: 8,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 100
            },
            deviceId: 2
          },
          {
            id: 9,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 53
            },
            deviceId: 2
          },
          {
            id: 10,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 52
            },
            deviceId: 2
          },
          {
            id: 11,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 21
            },
            deviceId: 2
          },
          {
            id: 12,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 29
            },
            deviceId: 2
          },
          {
            id: 13,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 11
            },
            deviceId: 2
          },
          {
            id: 14,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 76
            },
            deviceId: 2
          },
          {
            id: 15,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 76
            },
            deviceId: 2
          },
          {
            id: 16,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 73
            },
            deviceId: 2
          },
          {
            id: 17,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: 68
            },
            deviceId: 2
          }
        ]
      }.values
    );
  }

  function processData() {
    let dataset = getChartJSDataset(
      {
        r: Math.floor(Math.random() * 255),
        g: Math.floor(Math.random() * 255),
        b: Math.floor(Math.random() * 255)
      },
      "Occupancy",
      occupancyData.data
    );

    return getChartJSData(occupancyData.timestamps, [dataset]);
  }

  return (
    <div className="OccupancyDialog">
      {!showSpinner ? (
        <React.Fragment>
          {/* <Card className="dialog-graph">
            <div>
              <h2>Occupancy</h2>
              { occupancyData != null ?
                <Line data={processData()} options={getChartJSOptions()}></Line>
                : null
              }
            </div>
          </Card> */}
          <div className="dialog-graph-params">
            <h2>Occupancy Statistics</h2>
            <p>The minimum occupancy over the selected time period was {min}</p>
            <div style={{ height: "12px" }}></div>
            <p>The maximum occupancy over the selected time period was {max}</p>
            <div style={{ height: "12px" }}></div>
            <p>The average occupancy over the selected time period was {avg}</p>
            <div className="header-toggle">
              <h2>Date Range</h2>
              <CheckboxToggle
                value={projected}
                onChange={event => setProjected(!projected)}
              />
            </div>
            <div style={{ height: "16px" }} />

            <DateTimePicker
              // label="from"
              value={projectedFromDate}
              disabled={!projected}
            />
            <div style={{ height: "16px" }} />
            <DateTimePicker
              // label="to"
              value={projectedToDate}
              disabled={!projected}
            />
          </div>
          <Card className="dialog-graph-info">
            <div className="div1">
              <div>
                <h2>Occupancy Data</h2>
                <div style={{ height: "16px" }}/>
                {occupancyData != null ? (
                  <Line
                    data={processData()}
                    options={getChartJSOptions()}
                  ></Line>
                ) : null}
                <h2>Timeline</h2>
                <div style={{ height: "16px" }}/>
              </div>
            </div>
            <div className="div2">
              <NumberFocus subtitle="Min Occupants">{min}</NumberFocus>
            </div>
            <div className="div3">
              <NumberFocus subtitle="Max Occupants">{max}</NumberFocus>
            </div>
            <div className="div4">
              <NumberFocus subtitle="Average Occupants">{avg}</NumberFocus>
            </div>
          </Card>
        </React.Fragment>
      ) : (
        <Spinner></Spinner>
      )}
    </div>
  );
}

export default OccupancyDialog;
