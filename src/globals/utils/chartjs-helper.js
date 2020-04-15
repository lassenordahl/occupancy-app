export function getChartJSDataset(
  color,
  datasetLabel,
  datasetData,
  fill,
  dashed = []
) {
  return {
    label: datasetLabel,
    fill: fill,
    lineTension: 0.1,
    backgroundColor: `rgba(${color.r},${color.g},${color.b},0.4)`,
    borderColor: `rgba(${color.r},${color.g},${color.b},1)`,
    borderCapStyle: "butt",
    borderDash: dashed,
    borderDashOffset: 0.0,
    borderJoinStyle: "miter",
    pointBorderColor: `rgba(${color.r},${color.g},${color.b},1)`,
    pointBackgroundColor: "#fff",
    pointBorderWidth: 1,
    pointHoverRadius: 5,
    pointHoverBackgroundColor: `rgba(${color.r},${color.g},${color.b},1)`,
    pointHoverBorderColor: "rgba(220,220,220,1)",
    pointHoverBorderWidth: 2,
    pointRadius: 1,
    pointHitRadius: 10,
    data: datasetData
  };
}

export function getChartJSData(dataLabels, dataDatasets) {
  return {
    labels: dataLabels,
    datasets: dataDatasets
  };
}

export function getChartJSOptions(darkmode) {
  return {
    scales: {
      yAxes: [
        {
          ticks: {
            beginAtZero: true,
            fontColor: darkmode ? "white" : "black"
          }
        }
      ],
      xAxes: [
        {
          type: 'time',
          distribution: 'linear',
          ticks: {
            fontColor: darkmode ? "white" : "black"
          }
        }
      ]
    },
    legend: {
      position: "bottom",
      labels: {
        fontColor: darkmode ? "white" : "black"
      }
    }
  };
}

export function getGraphColor(index) {
  if (index < 7) {
    return [
      {
        r: 39,
        g: 73,
        b: 196
      },
      {
        r: 204,
        g: 37,
        b: 41
      },
      {
        r: 62,
        g: 150,
        b: 81
      },
      {
        r: 107,
        g: 76,
        b: 154
      },
      {
        r: 124,
        g: 37,
        b: 48
      },
      {
        r: 83,
        g: 81,
        b: 84
      },
      {
        r: 204,
        g: 37,
        b: 41
      }
    ][index];
  } else {
    return {
      r: Math.floor(Math.random() * 255),
      g: Math.floor(Math.random() * 255),
      b: Math.floor(Math.random() * 255)
    };
  }
}
