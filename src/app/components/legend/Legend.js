import React from "react";
import './Legend.scss';

import LegendRow from './legend-row/LegendRow';

const ranges = [
  {
    color: '#000000',
    range: '0-20'
  },
  {
    color: '#000000',
    range: '21-50'
  },
  {
    color: '#000000',
    range: '51-100'
  },
  {
    color: '#000000',
    range: '100+'
  }
]

function Legend() {
  return (
    <div className="Legend">
      {ranges.map(function(row, index) {
        return (
          <LegendRow color={row.color} range={row.range} key={index}></LegendRow>
        );
      })}
    </div>
  );
}

export default Legend;
