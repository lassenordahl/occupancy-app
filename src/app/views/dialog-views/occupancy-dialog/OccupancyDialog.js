import React, { useEffect, useState } from "react";
import './OccupancyDialog.scss';

import { Card, NumberFocus} from 'app/containers';
import { Line } from 'react-chartjs-2';

import {
  getChartJSData,
  getChartJSDataset,
  getChartJSOptions
} from 'globals/chartjs-helper.js';

import { Spinner } from 'react-rainbow-components';

function OccupancyDialog() {

  const [showSpinner, setShowSpinner] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setShowSpinner(false);
    }, 1000);
  }, [showSpinner]);

  function processData() {
    let labels = [...Array(50).keys()].map(function(number) {
      return number + 1;
    });

    let data = [...Array(50).keys()].map(function(number) {
      return Math.floor(Math.random() * 100);
    });

    let dataset = getChartJSDataset({
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255),
    }, "Sample Data", data);

    return getChartJSData(labels, [dataset])
  }

  return (
    <div className="OccupancyDialog">
      { !showSpinner ? 
        <React.Fragment>
          <Card className="dialog-graph">
            <div>
              <h2>Occupancy</h2>
              <Line data={processData()} options={getChartJSOptions()}></Line>
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
