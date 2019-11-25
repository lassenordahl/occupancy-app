import React, { useEffect } from "react";
import './FloorMap.scss';

import * as d3 from 'd3';
import Rainbow from 'rainbowvis.js';

const BG_COLOR = '#123'  
const COLOR = '#fff'  

const test_rooms = [
  {
    name: 'DBH 2059',
    "x1": 0,
    "y1": 0,
    "x2": 74,
    "y2": 22,
    occupancy: 3
  },
  {
    name: 'test2',
    "x1": 10,
    "y1": 0,
    "x2": 83,
    "y2": 12,
    occupancy: 39
  },
  {
    name: 'test3',
    "x1": 0,
    "y1": 19,
    "x2": 44,
    "y2": 64,
    occupancy: 87
  }
]
const margin = 100; // in px
const hover_size_bump = 6;
const rectangle_size = 120;

class FloorMap extends React.Component{
  constructor(props) {
    super(props);

    this.drawContent = this.drawContent.bind(this);
  }

  componentDidMount() {
    this.drawContent();
    window.addEventListener('resize', this.drawContent);
  }

  scale(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  bufferText(text, length = 8) {
    if (text.length >= length) {
      return text;
    } else {
      while (text.length <= length) {
        text = '\u00A0' + text;
      }
      return text;
    }
  }

  drawContent() {
    let self = this;
    let rainbow = new Rainbow();
    rainbow.setSpectrum('#64b1e8', '#3e2ed1');
    rainbow.setNumberRange(0, 200);

    self.svg.selectAll('*').remove();
    
    this.rooms = test_rooms.map(function(room) {

      let clientWidth = self.svg._groups[0][0].clientWidth;
      let clientHeight = self.svg._groups[0][0].clientHeight;

      let x = margin + self.scale(room.x1, 0, 100, 0, clientWidth - margin - 200); // Subtract 400 to account for the information card on the side
      let y = margin + self.scale(room.y1, 0, 100, 0, clientHeight - margin);

      let curr_room = self.svg.append('rect')
                        .attr('x', x)
                        .attr('y', y)
                        .attr('width', rectangle_size)
                        .attr('height', rectangle_size)
                        .style('fill', '#' + rainbow.colourAt(room.occupancy));

      self.svg.append('text')
        .attr('x', x + rectangle_size / 4)
        .attr('y', y + rectangle_size / 2)
        .attr('dy', '.35em')
        .style('fill', '#f7f9ff')
        .text(function(d) {
          console.log(self.bufferText(room.name));
          return self.bufferText(room.name);
        });

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
