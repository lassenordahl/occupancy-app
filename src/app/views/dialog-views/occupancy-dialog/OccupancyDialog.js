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
  CheckboxToggle,
} from "react-rainbow-components";
import Slider from "rc-slider";
import _ from "lodash";
import Fade from "react-reveal/Fade";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTimes } from "@fortawesome/free-solid-svg-icons";

import { Card, NumberFocus } from "app/containers";
import { SkeletonPulse } from "app/components";

import {
  getChartJSData,
  getChartJSDataset,
  getChartJSOptions,
  getGraphColor,
} from "globals/utils/chartjs-helper";

import { capitalizeWords } from "globals/utils/formatting-helper";
import { create } from "d3";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

function OccupancyDialog(props) {
  // List of entitity ID's
  const [comparedEntities, setComparedEntities] = useState([props.entity]);
  const [entityOccupantData, setEntityOccupantData] = useState([]);
  const [showSpinner, setShowSpinner] = useState(true);
  const [occupancyData, setOccupancyData] = useState(null);
  const [filteredOccupancyData, setFilteredOccupancyData] = useState(null);

  // Filter Variables
  const [filterMin, setFilterMin] = useState(null);
  const [filterMax, setFilterMax] = useState(null);

  // Variables for containing max, min, and average information
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [avg, setAvg] = useState(null);

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
    getOccupancyInformation(props.entity, true);
    // if (props.entity !== null) {
    //   getOccupancyInformation(props.entity);
    // }
  }, [props.entity]);

  function mapObservationValues(observationValues, isFirstIndex) {
    let maxVal = Number.MIN_SAFE_INTEGER;
    let maxTimestamp = null;
    let minVal = Number.MAX_SAFE_INTEGER;
    let minTimestamp = null;
    let total = 0;

    let data = observationValues.map(function (observation) {
      total += observation.payload.value;
      if (observation.payload.value > maxVal) {
        maxVal = observation.payload.value;
        maxTimestamp = observation.timestamp;
      }
      if (observation.payload.value < minVal) {
        minVal = observation.payload.value;
        minTimestamp = observation.timestamp;
      }
      return observation.payload.value;
    });

    let timestamps = observationValues.map(function (observation) {
      return moment(observation.timestamp).format("MMM Do h:mm:ss");
    });

    setMin({
      value: minVal,
      timestamp: minTimestamp
    });

    setMax({
      value: maxVal,
      timestamp: maxTimestamp
    });

    setAvg(Math.floor(total / observationValues.length));

    // We need to have a filtered data object because chartJS has an issue where it will splice the first element of the array
    // without making a copy, thus to not lose data on splicing the first object, we need to have another array
    // that is repopulated with data from the first index everytime we change the timeline
    if (isFirstIndex) {
      setFilteredOccupancyData({
        data: data.slice(),
        timestamps: timestamps.slice(),
      });
    }

    return {
      data: data,
      timestamps: timestamps,
    };
  }

  // Get the occupancy information for every comparable entity
  function getOccupancyInformation(entity, isFirstIndex) {
    // Make the call  for the occupancy data
    let occupancyObject = mapObservationValues(
      {
        resultCode: 400,
        message: "Values found with search parameters.",
        values: [
          {
            id: 6,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 7,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 8,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 9,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 10,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 11,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 12,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 13,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 14,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 15,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 16,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 17,
            timestamp: 1583376545000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
        ],
      }.values,
      isFirstIndex
    );

    // Add the occupancy data to the observation values
    setEntityOccupantData([...entityOccupantData, occupancyObject]);
  }

  function processData() {
    // Get all the datasets
    let datasets = entityOccupantData.map(function (
      occupancyDataObject,
      index
    ) {
      return getChartJSDataset(
        getGraphColor(index),
        index < comparedEntities.length
          ? comparedEntities[index].name
          : "Occupancy",
        index === 0
          ? filteredOccupancyData.data
          : occupancyDataObject.data.slice(filterMin, filterMax)
      );
    });

    return getChartJSData(filteredOccupancyData.timestamps, datasets);
  }

  // Set the filtered occupancy data to what the timeline range is
  function setTimelines(value) {
    setFilterMin(value[0]);
    setFilterMax(value[1]);

    setFilteredOccupancyData({
      data: entityOccupantData[0].data.slice(value[0], value[1]),
      timestamps: entityOccupantData[0].timestamps.slice(value[0], value[1]),
    });
  }

  // Add a comparable entityy
  function addToComparedEntities(newEntity) {
    setComparedEntities([...comparedEntities, newEntity]);
    getOccupancyInformation(newEntity);
  }

  function removeComparedEntity(removedEntity) {
    let removedIndex = -1;
    setComparedEntities(
      _.reject(comparedEntities, function (entity, index) {
        if (entity.id === removedEntity.id) {
          removedIndex = index;
        }
        return entity.id === removedEntity.id;
      })
    );
    setEntityOccupantData(
      _.reject(entityOccupantData, function (occupantData, index) {
        return removedIndex === index;
      })
    );
  }

  return (
    <div className="OccupancyDialog">
      {!showSpinner ? (
        <React.Fragment>
          <div className="dialog-graph-params">
            {/* <div className="header-toggle">
              <h2>Projected Date Range</h2>
              <CheckboxToggle
                value={projected}
                onChange={(event) => setProjected(!projected)}
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
            /> */}

            <h2>Compare Spaces</h2>
            <Picklist
              // value={selectedEntity}
              onChange={(option) => addToComparedEntities(option.value)}
              placeholder="Select a comparable entity"
            >
              {[
                { name: "test1", id: 1 },
                { name: "test2", id: 2 },
                { name: "test3", id: 3 },
                { name: "test4", id: 4 },
                { name: "test5", id: 5 },
                { name: "test6", id: 6 },
              ]
                .sort(function (a, b) {
                  if (a.name < b.name) return -1;
                  if (a.name > b.name) return 1;
                  return 0;
                })
                .filter(function (entity) {
                  return !comparedEntities
                    .map((entity) => entity.id)
                    .includes(entity.id);
                })
                .map(function (entity, index) {
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
            {comparedEntities.slice(1).map(function (entity) {
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
                <Line data={processData()} options={getChartJSOptions()}></Line>
                <h2>Timeline</h2>
                <div style={{ height: "16px" }} />
                <div style={{ marginLeft: "48px", marginRight: "48px" }}>
                  <Range
                    min={0}
                    max={entityOccupantData[0].timestamps.length - 1}
                    defaultValue={[0, entityOccupantData[0].data.length - 1]}
                    tipFormatter={(value) =>
                      `${entityOccupantData[0].timestamps[value]}`
                    }
                    trackStyle={[{ backgroundColor: "#2749c4" }]}
                    onChange={setTimelines}
                  />
                </div>
                <div className="range-labels">
                  <p>
                    {entityOccupantData[0].timestamps[0]}
                  </p>
                  <p>
                    {entityOccupantData[0].timestamps[entityOccupantData[0].timestamps.length - 1]}
                  </p>
                </div>
              </div>
            </div>
            <div className="div2">
              <NumberFocus subtitle="Minimum" lastUpdated={ min !== null ? min.timestamp : null }>
                {min !== null ? (
                  min.value
                ) : (
                  <SkeletonPulse
                    style={{ width: "50px", height: "50px", margin: "20px" }}
                  />
                )}
              </NumberFocus>
            </div>
            <div className="div3">
              <NumberFocus subtitle="Maximum" lastUpdated={ max !== null ? max.timestamp : null }>
                {max !== null ? (
                  max.value
                ) : (
                  <SkeletonPulse
                    style={{ width: "50px", height: "50px", margin: "20px" }}
                  />
                )}
              </NumberFocus>
            </div>
            <div className="div4">
              <NumberFocus subtitle="Average Average">
                {avg !== null ? (
                  avg
                ) : (
                  <SkeletonPulse
                    style={{ width: "50px", height: "50px", margin: "20px" }}
                  />
                )}
              </NumberFocus>
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
