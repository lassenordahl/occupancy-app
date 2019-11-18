import React from "react";
import './D3Shape.scss';

import * as d3 from 'd3';

const shape_scale = 50
const container_width = 400 - 72;
const container_height = 100;

class D3Shape extends React.Component{
  constructor(props) {
    super(props);

    this.drawContent = this.drawContent.bind(this);
  }

  componentDidMount() {
    let smallest_val = this.calculateSmallestCoordinate(this.props.coordinates);
    let new_coordinates = this.shiftToOrigin(this.props.coordinates, smallest_val);
    let drawable_coordinates = this.mapToDrawableCoordinates(new_coordinates);
    this.drawContent(drawable_coordinates);
  }

  calculateSmallestCoordinate(coordinates) {
    return Math.min(
            this.calculate(Math.min, coordinates, true),
            this.calculate(Math.min, coordinates, true)
          );
  }

  calculate(math_function, coordinates, is_x) {
    return math_function(...coordinates.map(function(coordinate) {
      return coordinate[is_x ? 0 : 1]
    }));
  }

  shiftToOrigin(coordinates, smallest_val) {
    return coordinates.map(function(coordinate){
      return [coordinate[0] - smallest_val, coordinate[1] - smallest_val];
    });
  }

  mapToDrawableCoordinates(coordinates) {
    let self = this;

    let minX = this.calculate(Math.min, coordinates, true);
    let maxX = this.calculate(Math.max, coordinates, true);
    let minY = this.calculate(Math.min, coordinates, false);
    let maxY = this.calculate(Math.max, coordinates, false);

    return coordinates.map(function(coordinate) {
      let polygon_x = self.scale(coordinate[0], minX, maxX, 0, shape_scale);
      let polygon_y = self.scale(coordinate[1], minY, maxY, 0, shape_scale)
      let x_midpoint = container_width / 2;
      let y_midpoint  = container_height / 2;

      // Shift the polygon to the center
      let x_point = polygon_x + x_midpoint - shape_scale/2; // Because of the way we map MAX-X -> shape_scale, we can always assume the polygon will have a height/width of 50
      let y_point = polygon_y + y_midpoint - shape_scale/2; // Thus we can scale it back a lil by shape_scale/2 to center it

      // X needs to be reflected across the center axis
      let x_final = x_point > x_midpoint ? x_point - 2 * (x_point - x_midpoint) : x_point + 2 * (x_midpoint - x_point);
      let y_final = y_point > y_midpoint ? y_point - 2 * (y_point - y_midpoint) : y_point + 2 * (y_midpoint - y_point);

      return [
        // x_final, 
        x_point,
        y_final
      ];
    });
  }

  scale(num, in_min, in_max, out_min, out_max) {
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
  }

  drawContent(coordinates) {
    this.svg.append('polygon')
      .attr('points', [...coordinates.map(function(coordinate){
        return [coordinate[0], coordinate[1]].join(",")
      })].join(" "))
      .attr('transform', 'scale(1, 1)')
      .attr('fill', '#4869e4')
      .attr('stroke', '#2749c4')
      .attr('stroke-width', '5')
  }

  render() {
    return (
      <svg
        className="D3Shape"
        ref={handle => (this.svg = d3.select(handle))}
      >
      </svg>
    )
  }
}

export default D3Shape;
