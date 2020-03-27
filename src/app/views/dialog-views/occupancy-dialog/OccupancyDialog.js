import React, { useEffect, useState } from "react";
import "./OccupancyDialog.scss";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

import moment from "moment";
import { Line } from "react-chartjs-2";
import {
  Spinner,
  Picklist,
  PicklistOption,
  DateTimePicker,
  CheckboxToggle
} from "react-rainbow-components";
import Tooltip from "rc-tooltip";
import Slider from "rc-slider";
import _ from 'lodash';

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { Card, NumberFocus } from "app/containers";

import {
  getChartJSData,
  getChartJSDataset,
  getChartJSOptions
} from "globals/utils/chartjs-helper";

import { capitalizeWords } from "globals/utils/formatting-helper";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

function OccupancyDialog(props) {
  // List of entitity ID's
  const [comparedEntities, setComparedEntities] = useState([props.entity]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [observationValues, setObservationValues] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [filteredOccupancyData, setFilteredOccupancyData] = useState(null);

  // Variables for containing max, min, and average information
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [avg, setAvg] = useState(0);

  // Projected Dates and projected enable variable
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
      return moment(observation.timestamp).format("MMM Do h:mm:ss");
    });

    setMax(maxVal);
    setMin(minVal);
    setAvg((total / observationValues.length).toFixed(1));

    setOccupancyData({
      data: data,
      timestamps: timestamps
    });

    setFilteredOccupancyData({
      data: data.slice(),
      timestamps: timestamps.slice()
    });
  }

  function getOccupancyInformation(entityId) {
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
        r: 39,
        g: 73,
        b: 196
      },
      "Occupancy",
      filteredOccupancyData.data
    );

    return getChartJSData(filteredOccupancyData.timestamps, [dataset]);
  }

  function setTimelines(value) {
    setFilteredOccupancyData({
      data: occupancyData.data.slice(value[0], value[1]),
      timestamps: occupancyData.timestamps.slice(value[0], value[1])
    });
  }

  function addToComparedEntities(newEntity) {
    console.log(newEntity);
    setComparedEntities([...comparedEntities, newEntity]);
  }

  function removeComparedEntity(removedEntity) {
    setComparedEntities(_.reject(comparedEntities, function(entity) {
      return entity.id === removedEntity.id;
    }));
  }

  return (
    <div className="OccupancyDialog">
      {!showSpinner ? (
        <React.Fragment>
          <div className="dialog-graph-params">
            <h2>Occupancy Statistics</h2>
            <p>The minimum occupancy over the selected time period was {min}</p>
            <div style={{ height: "12px" }}></div>
            <p>The maximum occupancy over the selected time period was {max}</p>
            <div style={{ height: "12px" }}></div>
            <p>The average occupancy over the selected time period was {avg}</p>

            <div className="header-toggle">
              <h2>Projected Date Range</h2>
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

            <h2>Compare Spaces</h2>
            <Picklist
              // value={selectedEntity}
              onChange={option => addToComparedEntities(option.value)}
              placeholder="Select a comparable entity"
            >
              {[
                { name: "test", id: 1 },
                { name: "test2", id: 2 }
              ]
                .sort(function(a, b) {
                  if (a.name < b.name) return -1;
                  if (a.name > b.name) return 1;
                  return 0;
                })
                .filter(function(entity) {
                  console.log(comparedEntities.map(entity => entity.id));
                  return !comparedEntities
                    .map(entity => entity.id)
                    .includes(entity.id);
                })
                .map(function(entity, index) {
                  return (
                    <PicklistOption
                      key={index}
                      name={entity.name}
                      label={capitalizeWords(entity.name)}
                      value={entity}
                    />
                  );
                })}
            </Picklist>
            {comparedEntities.slice(1).map(function(entity) {
              return (
                <div className="dialog-entity-list-item">
                  <p>{entity.name}</p>
                  <FontAwesomeIcon
                    icon={faTimes}
                    onClick={() => removeComparedEntity(entity)}
                  ></FontAwesomeIcon>
                </div>
              );
            })}
          </div>
          <Card className="dialog-graph-info">
            <div className="div1">
              <div>
                <h2>Occupancy Data</h2>
                <div style={{ height: "16px" }} />
                {occupancyData != null ? (
                  <Line
                    data={processData()}
                    options={getChartJSOptions()}
                  ></Line>
                ) : null}
                <h2>Timeline</h2>
                <div style={{ height: "16px" }} />
                <div style={{ marginLeft: "36px", marginRight: "36px" }}>
                  <Range
                    min={0}
                    max={occupancyData.data.length - 1}
                    defaultValue={[0, occupancyData.data.length - 1]}
                    tipFormatter={value => `${occupancyData.timestamps[value]}`}
                    trackStyle={[{ backgroundColor: "#2749c4" }]}
                    onChange={setTimelines}
                  />
                </div>
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
