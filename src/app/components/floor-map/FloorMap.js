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
    this.getOccupancy = this.getOccupancy.bind(this);
  }

  componentDidMount() {
    this.drawContent();
    window.addEventListener("resize", this.drawContent);
  }

  scale(num, in_min, in_max, out_min, out_max) {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }

  bufferText(text, length = 10) {
    if (text.length >= length) {
      return text;
    } else {
      while (text.length <= length) {
        text = "\u00A0" + text;
      }
      return text;
    }
  }

  getOccupancy(index) {
    if (this.props.occupancies[index] !== undefined) {
      return this.props.occupancies[index];
    } else {
      return 0;
    }
  }


  getGraphedEntity(shapeType, entityCoordInfo, occupancy) {
    let rainbow = new Rainbow();
    rainbow.setSpectrum("#64b1e8", "#3e2ed1");
    rainbow.setNumberRange(0, 200);

    console.log('entity corod info', entityCoordInfo);

    let self = this;
    if (shapeType === "rectangle") {
      return self.svg
        .append("rect")
        .attr("x", entityCoordInfo.start.x)
        .attr("y", entityCoordInfo.start.y)
        .attr(
          "width",
          Math.abs(entityCoordInfo.end.x - entityCoordInfo.start.x)
        )
        .attr(
          "height",
          Math.abs(entityCoordInfo.end.y - entityCoordInfo.start.y)
        )
        .style("fill", "#" + rainbow.colourAt(occupancy));
    }
  }

  getHalfWidth(word) {
    return (word.length / 2) * 11;
  }

  

  drawContent() {
    let self = this;

    self.svg.selectAll("*").remove();

    if (self.svg._groups[0][0] === null) {
      return;
    }

    this.entities = self.props.twoDimensionalEntities.map(function(entity, index) {
      let clientWidth = self.svg._groups[0][0].clientWidth;
      let clientHeight = self.svg._groups[0][0].clientHeight;

      console.log(entity.payload.geo.extent);

      let coordInfo = JSON.parse(JSON.stringify(entity.payload.geo.extent));
      let coordSystem = entity.payload.geo.coordinateSystem;
      let range = coordSystem.range;

      let margin = 40;


      coordInfo.start.x = self.scale(
        coordInfo.start.x,
        range.xMin,
        range.xMax,
        margin,
        clientWidth - margin
      );
      coordInfo.start.y = self.scale(
        coordInfo.start.y,
        range.yMin,
        range.yMax,
        margin,
        clientHeight - margin
      );

      coordInfo.end.x = self.scale(
        coordInfo.end.x,
        range.xMin,
        range.xMax,
        margin,
        clientWidth - margin
      );
      coordInfo.end.y = self.scale(
        coordInfo.end.y,
        range.yMin,
        range.yMax,
        margin,
        clientHeight - margin
      );

      console.log(coordInfo);

      let currEntity = self.getGraphedEntity(
        coordInfo.extentClassName,
        coordInfo,
        self.getOccupancy(index)
      );

      // console.log(currEntity);

      currEntity.on("mouseover", function() {
        d3.select(this);
        self.svg
          .append("text")
          .attr(
            "x",
            coordInfo.start.x +
              Math.abs(coordInfo.end.x - coordInfo.start.x) / 2 -
              self.getHalfWidth(entity.name)
          )
          .attr("y", coordInfo.start.y - 20)
          .attr("font-family", "Montserrat")
          .attr("font-size", "20px")
          .attr("fill", "black")
          .text(function(d) {
            // console.log(self.bufferText(entity.name));
            return entity.name;
          });

        // .attr(
        //   "transform",
        //   "translate(" +
        //     (-1 * hover_size_bump) / 4 +
        //     "," +
        //     (-1 * hover_size_bump) / 4 +
        //     ")"
        // )
        // .attr("width", rectangle_size + hover_size_bump)
        // .attr("height", rectangle_size + hover_size_bump);
      });

      currEntity.on("mouseout", function() {
        d3.select(this);
        self.drawContent();
        //     .attr(
        //       "transform",
        //       "translate(" + hover_size_bump / 4 + "," + hover_size_bump / 4 + ")"
        //     )
        //     .attr("width", rectangle_size)
        //     .attr("height", rectangle_size);
      });

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
        <div className="floormap-margin"></div>
      </div>
    );
  }
}

export default FloorMap;
