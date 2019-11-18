import React, { useEffect } from "react";
import './FloorMap.scss';

import * as d3 from 'd3';
import Rainbow from 'rainbowvis.js';

const BG_COLOR = '#123'  
const COLOR = '#fff'  

const test_rooms = [
  {
    name: 'DBH 2059',
    "x1": 68,
    "y1": 10,
    "x2": 74,
    "y2": 22,
    occupancy: 3
  },
  {
    name: 'test2',
    "x1": 74,
    "y1": 9,
    "x2": 83,
    "y2": 12,
    occupancy: 39
  },
  {
    name: 'test3',
    "x1": 35,
    "y1": 53,
    "x2": 44,
    "y2": 64,
    occupancy: 87
  }
]
const margin = 100; // in px
const hover_size_bump = 6;
const rectangle_size = 50;

class FloorMap extends React.Component{
  constructor(props) {
    super(props);

    this.drawContent = this.drawContent.bind(this);
  }

  componentDidMount() {
    this.drawContent();

    
  }

  scale(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  drawContent() {
    let self = this;
    let rainbow = new Rainbow();
    rainbow.setSpectrum('#64b1e8', '#3e2ed1');
    rainbow.setNumberRange(0, 200);
    
    this.rooms = test_rooms.map(function(room) {

      let x = margin + self.scale(room.x1, 0, 100, 0, 400);
      let y = margin + self.scale(room.y1, 0, 100, 0, 400)

      let curr_room = self.svg.append('rect')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('width', rectangle_size)
                        .attr('height', rectangle_size)
                        .style('fill', '#' + rainbow.colourAt(room.occupancy));

      curr_room.on('click', function() {
        // alert('you clicked' + room.occupancy);
        self.props.selectRoom(room);
      });

      curr_room.on('mouseover', function() {
        d3.select(this)
          .attr('transform', 'translate(' + -1 * hover_size_bump / 4 + ',' + -1 * hover_size_bump / 4 + ')')
          .attr('width', rectangle_size + hover_size_bump)
          .attr('height', rectangle_size + hover_size_bump)
      });

      curr_room.on('mouseout', function() {
        d3.select(this)
          .attr('transform', 'translate(' + hover_size_bump / 4 + ',' + hover_size_bump / 4 + ')')
          .attr('width', rectangle_size)
          .attr('height', rectangle_size);
      });
      return curr_room;
    });
  }

  render() {
    return (
      <svg
        className="FloorMap"
        ref={handle => (this.svg = d3.select(handle))}
      >
      </svg>
    )
  }
}

export default FloorMap;
