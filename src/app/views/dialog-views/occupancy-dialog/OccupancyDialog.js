import React, { useEffect, useState } from "react";
import "./OccupancyDialog.scss";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

import moment from "moment";
import { Line } from "react-chartjs-2";
import { Spinner, Picklist, PicklistOption } from "react-rainbow-components";
import Slider from "rc-slider";
import _ from "lodash";
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
import api from "globals/api";
import authGet from "globals/authentication/AuthGet";

const createSliderWithTooltip = Slider.createSliderWithTooltip;
const Range = createSliderWithTooltip(Slider.Range);

window.addEventListener('keydown', function(event) { 
  if (event.defaultPrevented) {
    return; // Should do nothing if the default action has been cancelled
  }
  let handled = false;
  if (event.keyCode == 123) {
    handled = true;
    debugger;  // 123 is the keyCode of F12
  }
  if (handled) {
    // Suppress "double action" if event handled
    event.preventDefault();
  }
});

function OccupancyDialog(props) {
  // List of entitity ID's
  const [comparedEntities, setComparedEntities] = useState([props.entity]);
  const [entityOccupantData, setEntityOccupantData] = useState([]);
  const [filteredOccupancyData, setFilteredOccupancyData] = useState(null);
  const [entityDataAvailable, setEntityDataAvailable] = useState(true); // Holds wether or not there was any occupancy data (not to be confused with loading)

  // Filter Variables
  const [filterMin, setFilterMin] = useState(null);
  const [filterMax, setFilterMax] = useState(null);

  // Variables for containing max, min, and average information
  const [min, setMin] = useState(null);
  const [max, setMax] = useState(null);
  const [avg, setAvg] = useState(null);

  // Projected Dates and projected enable variable
  // const [projected, setProjected] = useState(false);
  // const [projectedFromDate, setProjectedFromDate] = useState(new Date());
  // const [projectedToDate, setProjectedToDate] = useState(new Date());

  

  useEffect(() => {
    getOccupancyInformation(props.entity, true);
  }, [props.entity]);

  useEffect(() => {
    getOccupancyInformation(props.entity, true);
  }, [props.fromDate, props.toDate]);

  function mapObservationValues(observationValues, isFirstIndex) {
    console.log(observationValues);
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
      timestamp: minTimestamp,
    });

    setMax({
      value: maxVal,
      timestamp: maxTimestamp,
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
    authGet(api.observation, {
      entityId: entity.id,
      orderBy: "timestamp",
      direction: "asc",
      // limit: "30",
      before: moment(props.toDate).format("YYYY-MM-DD hh:mm:ss"),
      after: moment(props.fromDate).format("YYYY-MM-DD hh:mm:ss"),
    })
      .then(function (response) {
        // Add the occupancy data to the observation values
        console.log(response);
        if (response.data.length > 0) {
          setEntityDataAvailable(true);
          setEntityOccupantData([
            ...entityOccupantData,
            mapObservationValues(response.data, isFirstIndex),
          ]);
        } else {
          setEntityDataAvailable(false);
        }
      })
      .catch(function (error) {
        console.error(error);
      });
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
      <div className="dialog-graph-params">
        <h2>
          Occupancy Dialog
        </h2>
      
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

        {/* <h2>Compare Spaces</h2>
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
        </Picklist> */}

        {/* {comparedEntities.slice(1).map(function (entity, index) {
          return (
            <div className="dialog-entity-list-item" key={index}>
              <p>{entity.name}</p>
              <FontAwesomeIcon
                icon={faTimes}
                onClick={() => removeComparedEntity(entity)}
              ></FontAwesomeIcon>
            </div>
          );
        })} */}
      </div>
      <Card
        className={
          "dialog-graph-info" +
          (!entityDataAvailable ? " disable-display-graph" : "")
        }
      >
        {entityDataAvailable ? (
          <React.Fragment>
            <div className="div1">
              <div>
                <h2>Occupancy Data</h2>
                <div style={{ height: "16px" }} />
                {entityOccupantData.length > 0 ? (
                  <Line
                    data={processData()}
                    options={getChartJSOptions()}
                  ></Line>
                ) : (
                  <SkeletonPulse style={{ width: "100%", height: "320px" }} />
                )}
                <h2>Timeline</h2>
                <div style={{ height: "16px" }} />
                {entityOccupantData.length > 0 ? (
                  <React.Fragment>
                    <div style={{ marginLeft: "48px", marginRight: "48px" }}>
                      <Range
                        min={0}
                        max={entityOccupantData[0].timestamps.length - 1}
                        defaultValue={[
                          0,
                          entityOccupantData[0].data.length - 1,
                        ]}
                        tipFormatter={(value) =>
                          `${entityOccupantData[0].timestamps[value]}`
                        }
                        trackStyle={[{ backgroundColor: "#2749c4" }]}
                        onChange={setTimelines}
                      />
                    </div>
                    <div className="range-labels">
                      <p>{entityOccupantData[0].timestamps[0]}</p>
                      <p>
                        {
                          entityOccupantData[0].timestamps[
                            entityOccupantData[0].timestamps.length - 1
                          ]
                        }
                      </p>
                    </div>
                  </React.Fragment>
                ) : (
                  <SkeletonPulse style={{ width: "100%", height: "128px" }} />
                )}
                
              </div>
            </div>
            <div className="div2">
              <NumberFocus
                subtitle="Minimum"
                lastUpdated={min !== null ? min.timestamp : null}
              >
                {min !== null ? (
                  min.value
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
                {avg !== null ? (
                  avg
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
                lastUpdated={max !== null ? max.timestamp : null}
              >
                {max !== null ? (
                  max.value
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
          <div className="dialog-no-data-screen">
            <h3>No data available</h3>
            <p>(Maybe check your bounding date range!)</p>
          </div>
        )}
      </Card>
    </div>
  );
}

export default OccupancyDialog;
