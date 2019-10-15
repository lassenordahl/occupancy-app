import React from "react";
import './Legend.scss';
import Fade from 'react-reveal/Fade';

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
    <Fade duration={1500}>
      <div className="Legend">
        {ranges.map(function(row, index) {
          return (
            <LegendRow color={row.color} range={row.range} key={index}></LegendRow>
          );
        })}
      </div>
    </Fade>
  );
}

export default Legend;
