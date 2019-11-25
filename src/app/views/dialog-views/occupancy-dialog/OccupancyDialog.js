import React, { useEffect, useState } from "react";
import './OccupancyDialog.scss';

import axios from "axios";
import { Line } from 'react-chartjs-2';
import { Spinner } from 'react-rainbow-components';

import { Card, NumberFocus} from 'app/containers';

import {
  getChartJSData,
  getChartJSDataset,
  getChartJSOptions
} from 'globals/chartjs-helper.js';


function OccupancyDialog(props) {

  const [showSpinner, setShowSpinner] = useState(true);
  const [observationValues, setObservationValues] = useState(null);
  const [occupancyData, setOccupancyData] = useState(null);
  const [min, setMin] = useState(0);
  const [max, setMax] = useState(0);
  const [avg, setAvg] = useState(0);

  useEffect(() => {
    setTimeout(() => {
      setShowSpinner(false);
    }, 1000);
  }, [showSpinner]);

  useEffect(() => {
    if (props.entityId !== null) {
      getOccupancyInformation(props.entityId)
    }
  }, [props.entityId])

  useEffect(() => {
    if (observationValues !== null) {
      mapObservationValues();
    }
  }, [observationValues])

  function mapObservationValues() {
    let data = observationValues.map(function(observation) {
      return observation.payload.value;
    });
    let timestamps = observationValues.map(function(observation) {
      return observation.timestamp;
    });

    console.log(data, timestamps);

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
    setObservationValues({
      "resultCode": 400,
      "message": "Values found with search parameters.",
      "values": [
          {
              "id": 6,
              "timestamp": 1574717000,
              "payload": {
                  "entityId": 3,
                  "value": 100
              },
              "deviceId": 2
          },
          {
              "id": 7,
              "timestamp": 1574717000,
              "payload": {
                  "entityId": 3,
                  "value": 100
              },
              "deviceId": 2
          },
          {
              "id": 8,
              "timestamp": 1574717000,
              "payload": {
                  "entityId": 3,
                  "value": 100
              },
              "deviceId": 2
          }
      ]
    }.values);
  }

  function processData() {
    let dataset = getChartJSDataset({
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
    }, "Occupancy", occupancyData.data);

    return getChartJSData(occupancyData.timestamps, [dataset])
  }

  return (
    <div className="OccupancyDialog">
      { !showSpinner ? 
        <React.Fragment>
          <Card className="dialog-graph">
            <div>
              <h2>Occupancy</h2>
              { occupancyData != null ?
                <Line data={processData()} options={getChartJSOptions()}></Line>
                : null
              }
            </div>
          </Card>
          <div className="dialog-min">
            <NumberFocus subtitle="Minimum Occupants">
              38
            </NumberFocus>
          </div>
          <div className="dialog-max">
            <NumberFocus subtitle="Maximum Occupants">
              91
            </NumberFocus>
          </div>
          <div className="dialog-avg">
            <NumberFocus subtitle="Average Occupants">
              57.3
            </NumberFocus>
          </div>
          <div className="dialog-configuration">
            <h2>
              Floor Information
            </h2>
            <p>
              Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.
            </p>
          </div>
        </React.Fragment>
        : <Spinner></Spinner>
      }
      
    </div>
  );
}

export default OccupancyDialog;
