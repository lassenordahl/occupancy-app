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
    getOccupancyInformation(props.entity, true);
    // if (props.entity !== null) {
    //   getOccupancyInformation(props.entity);
    // }
  }, [props.entity]);

  function mapObservationValues(observationValues, createFilteredData) {
    let maxVal = Number.MIN_SAFE_INTEGER;
    let minVal = Number.MAX_SAFE_INTEGER;
    let total = 0;
    let data = observationValues.map(function (observation) {
      total += observation.payload.value;
      if (observation.payload.value > maxVal) {
        maxVal = observation.payload.value;
      }
      if (observation.payload.value < minVal) {
        minVal = observation.payload.value;
      }
      return observation.payload.value;
    });

    let timestamps = observationValues.map(function (observation) {
      return moment(observation.timestamp).format("MMM Do h:mm:ss");
    });

    // if (createFilteredData) {
    //   setFilteredOccupancyData({
    //     data: data.slice(),
    //     timestamps: timestamps.slice(),
    //   });
    // }

    return {
      data: data,
      timestamps: timestamps,
    };
  }

  // setFilteredOccupancyData({
  //   data: occupancyObject.data.slice(),
  //   timestamps: occupancyData.timestamps.slice()
  // })

  // Get the occupancy information for every comparable entity
  function getOccupancyInformation(entity, createFilteredData) {
    // Make the call  for the occupancy data
    let occupancyObject = mapObservationValues(
      {
        resultCode: 400,
        message: "Values found with search parameters.",
        values: [
          {
            id: 6,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 7,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 8,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 9,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 10,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 11,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 12,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 13,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 14,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 15,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 16,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
          {
            id: 17,
            timestamp: 1574717000,
            payload: {
              entityId: 3,
              value: Math.floor(Math.random() * 100),
            },
            deviceId: 2,
          },
        ],
      }.values,
      createFilteredData
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
        filterMin !== null && filterMax !== null
          ? occupancyDataObject.data.slice(filterMin, filterMax)
          : occupancyDataObject.data
      );
    });

    return getChartJSData(
      filterMin !== null && filterMax !== null
        ? entityOccupantData[0].timestamps.slice(filterMin, filterMax)
        : entityOccupantData[0].timestamps,
      datasets
    );
  }

  function getSubset(arr, min, max, isInt) {
    let subset = [];
    for (let i = min; i < max; i++) {
      if (isInt)
        subset.push(parseInt(arr[i].toString()));
    }
    console.log('SUBSETS', arr, subset);
    return subset;
  }

  // Set the filtered occupancy data to what the timeline range is
  function setTimelines(value) {
    setFilterMin(value[0]);
    setFilterMax(value[1]);

    console.log("FILTERED");
    console.log(entityOccupantData.map(function(occupancyDataObject, index) {
      // return (occupancyDataObject.data);
      return(occupancyDataObject.data.slice(value[0], value[1]));
    }));
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
            <div className="header-toggle">
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
            />

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
                <div style={{ marginLeft: "36px", marginRight: "36px" }}>
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
