import React, { useEffect, useState } from "react";
import "./OccupancyDialog.scss";
import "rc-slider/assets/index.css";
import "rc-tooltip/assets/bootstrap.css";

import moment from "moment";
import _ from "lodash";
import { Picklist, PicklistOption, Button } from "react-rainbow-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileCsv } from "@fortawesome/free-solid-svg-icons";
import { CSVLink } from "react-csv";

import {
  getChartJSData,
  getChartJSDataset,
  getGraphColor,
} from "globals/utils/chartjs-helper";
import { capitalizeWords } from "globals/utils/formatting-helper";
import api from "globals/api";
import authGet from "globals/authentication/AuthGet";
import OccupancyCard from "./occupancy-card/OccupancyCard";

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

  // // Upon getting an entity load the occupancy information
  // useEffect(() => {
  //   getOccupancyInformation(props.entity, true, false);
  // }, [props.entity]);

  // When the dates change load the occupancy data again, but we need to remove the first entity occupancy time
  useEffect(() => {
    getOccupancyInformation(props.entity, true, true);
  }, [props.entity, props.fromDate, props.toDate]);

  // Take in if we're going to use the first index,
  // If we're the first index (primary entity for this dialog), then we should load the max/min/avg values
  function mapObservationValues(observationValues, isFirstIndex) {
    let maxVal = Number.MIN_SAFE_INTEGER;
    let maxTimestamp = null;
    let minVal = Number.MAX_SAFE_INTEGER;
    let minTimestamp = null;
    let total = 0;

    console.log(observationValues);

    let data = observationValues.map(function (observation) {
      total += observation.payload.occupancy;
      if (observation.payload.occupancy > maxVal) {
        maxVal = observation.payload.occupancy;
        maxTimestamp = observation.timestamp;
      }
      if (observation.payload.occupancy < minVal) {
        minVal = observation.payload.occupancy;
        minTimestamp = observation.timestamp;
      }
      return observation.payload.occupancy;
    });

    // Format timestamps to correct output
    let timestamps = observationValues.map(function (observation) {
      return moment(observation.timestamp).toDate();
      // return moment(observation.timestamp).format("MMM Do h:mm:ss");
    });

    // console.log(timestamps);

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
  function getOccupancyInformation(
    entity,
    isFirstIndex,
    isReplacingFirstIndex
  ) {
    debugger;
    authGet(api.observation, {
      entityId: entity.id,
      orderBy: "timestamp",
      direction: "asc",
      // limit: "30",
      limit:"1000",
      before: moment(props.toDate).format("YYYY-MM-DD hh:mm:ss"),
      after: moment(props.fromDate).format("YYYY-MM-DD hh:mm:ss"),
    })
      .then(function (response) {
        // Add the occupancy data to the observation values
        if (response !== undefined) {
          if (response.data.length > 0) {
            setEntityDataAvailable(true);
  
            // If we're replacing the first index, this means that the date range has been updated and we need to refresh the value for the first one
            if (isReplacingFirstIndex) {
              setEntityOccupantData([
                mapObservationValues(response.data, isFirstIndex),
                ...entityOccupantData.slice(1),
              ]);
            } else {
              setEntityOccupantData([
                ...entityOccupantData,
                mapObservationValues(response.data, isFirstIndex),
              ]);
            }
          } else {
            setEntityDataAvailable(false);
          }
        }
      })
      .catch(function (error) {
        console.error(error);
      });
  }

  // Process the data for the ChartJS chart
  function processData() {
    // Get all the datasets
    let datasets = entityOccupantData.map(function (
      occupancyDataObject,
      index
    ) {
      // For each entity, pass in the filtered data
      // Except for the first index, we have another array that is ALREADY filtered because
      // ChartJS will cause issues with slicing that array and we'll permanently sub slice it and lose data
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

    // Get the ChartJS Data configuration
    return getChartJSData(filteredOccupancyData.timestamps, datasets);
  }

  // Set the filtered occupancy data to what the timeline range is
  function setTimelines(value) {
    setFilterMin(value[0]);
    setFilterMax(value[1]);

    // Generate a new object from the filtered occupancy data
    // Reasons are mentioned above in the processData function
    setFilteredOccupancyData({
      data: entityOccupantData[0].data.slice(value[0], value[1]),
      timestamps: entityOccupantData[0].timestamps.slice(value[0], value[1]),
    });
  }

  // Add a comparable entityy
  function addToComparedEntities(newEntity) {
    // Add to compared entities, make an occupancy request for the information
    setComparedEntities([...comparedEntities, newEntity]);
    getOccupancyInformation(newEntity, false, false);
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

  function exportCSV() {
    let csv = [];
    if (filteredOccupancyData !== null) {
      filteredOccupancyData.data.map(function (occupancyValue, index) {
        csv.push({
          occupancy: parseInt(occupancyValue),
          timestamp: moment(filteredOccupancyData.timestamps[index]).format("MMM Do YYYY h:mm:ss"),
        });
      });
    }
    return csv;
  }

  return (
    <div className="OccupancyDialog">
      <div className="dialog-graph-params">
        <h2>TIPPERS Occupancy Information</h2>
        <p>To the right is an array of statistics based on the space that you chose under the selected time period. Use the timeline to filter down on data. At the bottom of this section, you can export the data for the date range selected to a CSV.</p>
        <h2>Date Range</h2>
        <p>Occupancy values are pulled through the given time range, but limited to 1000 values maximum. If the defined date range does not match the one you queried, there is likely too much data.</p>
        <h2>Data</h2>
        <p>Data is provided by UCI OIT. View here:</p>
        <a href="https://www.oit.uci.edu/ics-and-oit-collaborate-on-tippers-research-project/">https://www.oit.uci.edu/ics-and-oit-collaborate-on-tippers-research-project/</a>
        <div style={{ height: "16px" }}></div>
        <div className="dialog-params-export-utilities">
          <div>
            <CSVLink data={exportCSV()}
            filename={"entity-" + props.entity.id + "-exported-data.csv"}>
              <Button variant="outline-brand" disabled={!entityDataAvailable || entityOccupantData.length === 0}>
                <FontAwesomeIcon
                  icon={faFileCsv}
                  className="rainbow-m-right_medium"
                ></FontAwesomeIcon>
                Export to CSV
              </Button>
            </CSVLink>
          </div>
        </div>
      </div>
      <OccupancyCard
        setTimelines={setTimelines}
        entityOccupantData={entityOccupantData}
        entityDataAvailable={entityDataAvailable}
        processData={processData}
        min={min}
        max={max}
        avg={avg}
      />
    </div>
  );
}

export default OccupancyDialog;
