import React from "react";
import "./FloorMap.scss";

import * as d3 from "d3";
import Rainbow from "rainbowvis.js";

const margin = 100; // in px
const hover_size_bump = 6;
const rectangle_size = 120;

class FloorMap extends React.Component {
  constructor(props) {
    super(props);

    this.drawContent = this.drawContent.bind(this);
  }

  

  componentDidMount() {
    this.drawContent();
    window.addEventListener("resize", this.drawContent);
  }

  scale(num, in_min, in_max, out_min, out_max) {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }

  bufferText(text, length = 8) {
    if (text.length >= length) {
      return text;
    } else {
      while (text.length <= length) {
        text = "\u00A0" + text;
      }
      return text;
    }
  }

  getGraphedEntity(shapeType, entityCoordInfo, occupancy) {

    let rainbow = new Rainbow();
    rainbow.setSpectrum("#64b1e8", "#3e2ed1");
    rainbow.setNumberRange(0, 200);
    
    let self = this;
    if (shapeType === "rectangle") {
      return (
        self.svg
        .append("rect")
        .attr("x", entityCoordInfo.start.x)
        .attr("y", entityCoordInfo.start.y)
        .attr("width", Math.abs(entityCoordInfo.end.x - entityCoordInfo.start.x))
        .attr("height", Math.abs(entityCoordInfo.end.y - entityCoordInfo.start.y))
        .style("fill", "#" + rainbow.colourAt(occupancy))
      );
    }
  }

  drawContent() {
    let self = this;

    self.svg.selectAll("*").remove();

    if (self.svg._groups[0][0] === null) {
      return;
    }

    this.entities = self.props.twoDimensionalEntities.map(function(entity) {

      console.log(entity);
      

      let clientWidth = self.svg._groups[0][0].clientWidth;
      let clientHeight = self.svg._groups[0][0].clientHeight;

      let coordInfo = JSON.parse(JSON.stringify(entity.payload.geo.extent));
      let coordSystem = entity.payload.geo.coordinateSystem;
      let range = coordSystem.range;

      coordInfo.start.x = self.scale(coordInfo.start.x, range.xMin, range.xMax, 0, clientWidth);
      coordInfo.start.y = self.scale(coordInfo.start.y, range.yMin, range.yMax, 0, clientHeight);
      
      coordInfo.end.x = self.scale(coordInfo.end.x, range.xMin, range.xMax, 0, clientWidth);
      coordInfo.end.y = self.scale(coordInfo.end.y, range.yMin, range.yMax, 0, clientHeight);

      let currEntity = self.getGraphedEntity(coordInfo.extentClassName, coordInfo, 100);

      // let clientWidth = self.svg._groups[0][0].clientWidth;
      // let clientHeight = self.svg._groups[0][0].clientHeight;

      // let x =
      //   margin + self.scale(entity.x1, 0, 100, 0, clientWidth); // Subtract 400 to account for the information card on the side
      // let y = margin + self.scale(entity.y1, 0, 100, 0, clientHeight);

      // let currEntity = self.svg
      //   .append("polygon")
      //   .attr("points", function(d) {
      //     return entity.verticies
      //       .map(function(verticie) {
      //         console.log((
      //           margin +
      //           self.scale(verticie.x, 0, 100, 0, clientWidth) +
      //           "," +
      //           (margin +
      //             self.scale(verticie.y, 0, 100, 0, clientWidth))
      //         ));
      //         return (
      //           margin +
      //           self.scale(verticie.x, 0, 100, 0, clientWidth) +
      //           "," +
      //           (margin +
      //             self.scale(verticie.y, 0, 100, 0, clientWidth))
      //         );
      //         // return verticie.x + ", " + verticie.y;
      //       })
      //       .join(" ");
      //   })
      //   .style("fill", "#" + rainbow.colourAt(entity.occupancy));

      // // self.svg.append('text')
      // //   .attr('x', x + rectangle_size / 4)
      // //   .attr('y', y + rectangle_size / 2)
      // //   .attr('dy', '.35em')
      // //   .style('fill', '#f7f9ff')
      // //   .text(function(d) {
      // //     console.log(self.bufferText(room.name));
      // //     return self.bufferText(room.name);
      // //   });

      // // curr_room.on("click", function() {
      // //   alert('you clicked' + entity.occupancy);
      // // });

      // currEntity.on("mouseover", function() {
      //   d3.select(this)
      //     .attr(
      //       "transform",
      //       "translate(" +
      //         (-1 * hover_size_bump) / 4 +
      //         "," +
      //         (-1 * hover_size_bump) / 4 +
      //         ")"
      //     )
      //     .attr("width", rectangle_size + hover_size_bump)
      //     .attr("height", rectangle_size + hover_size_bump);
      // });

      // currEntity.on("mouseout", function() {
      //   d3.select(this)
      //     .attr(
      //       "transform",
      //       "translate(" + hover_size_bump / 4 + "," + hover_size_bump / 4 + ")"
      //     )
      //     .attr("width", rectangle_size)
      //     .attr("height", rectangle_size);
      // });

      return currEntity;
    });
  }

  render() {
    return (
      <div className="FloorMap">
        <div className="floormap-map-wrapper">
          <svg
            className="floormap-canvas"
            ref={handle => (this.svg = d3.select(handle))}
          ></svg>
        </div>
        <div className="floormap-margin">

        </div>
      </div>
      
    );
  }
}

export default FloorMap;
