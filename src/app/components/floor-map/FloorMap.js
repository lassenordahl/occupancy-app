import React from "react";
import "./FloorMap.scss";

import * as d3 from "d3";
import getBlueRainbow from "globals/utils/rainbowvis-helper.js";

class FloorMap extends React.Component {
  constructor(props) {
    super(props);

    this.drawContent = this.drawContent.bind(this);
    this.getOccupancy = this.getOccupancy.bind(this);
    this.getGraphedEntity = this.getGraphedEntity.bind(this);
  }

  componentDidMount() {
    this.drawContent();
    // Re-render everything if our window changes
    window.addEventListener("resize", this.drawContent);
  }
  componentDidUpdate() {
    this.drawContent();
  }

  // Helper function to scale an input from one scale to another
  scale(num, in_min, in_max, out_min, out_max) {
    return ((num - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min;
  }

  // Adds whitespace to text so it is centered on a D3 SVG
  // This is necessary because there are no D3 functions that can find the center of an SVG so we have to do a little approximation
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

  // Get the occupancy at the given index
  getOccupancy(index) {
    if (this.props.occupancies[index] !== undefined) {
      return this.props.occupancies[index];
    } else {
      return 0;
    }
  }

  // Creates a graphable D3 entity for the d3 instance we're running on the page
  getGraphedEntity(shapeType, entityCoordInfo, occupancy) {
    let rainbow = getBlueRainbow(this.props.legendMax);

    let self = this;

    // Depending on the type of shape, we need to generate a differently formated SVG
    if (shapeType === "rectangle") {
      return self.svg
        .append("rect")
        .attr("x", entityCoordInfo.start.x + 2)
        .attr("y", entityCoordInfo.start.y + 2)
        .attr(
          "width",
          Math.abs(entityCoordInfo.end.x - entityCoordInfo.start.x - 4)
        )
        .attr(
          "height",
          Math.abs(entityCoordInfo.end.y - entityCoordInfo.start.y - 4)
        )
        .style(
          "fill",
          "#" +
            rainbow.colourAt(
              occupancy.payload !== undefined ? occupancy.payload.value : 1
            )
        );
    } else if (shapeType === "polygon") {
      return self.svg
        .append("polygon")
        .attr(
          "points",
          entityCoordInfo
            .map(function (verticie) {
              return [verticie.x, verticie.y].join(",");
            })
            .join(" ")
        )
        .style(
          "fill",
          "#" +
            rainbow.colourAt(
              occupancy.payload !== undefined ? occupancy.payload.value : 1
            )
        );
    }
  }

  // Returns the size of half of a word scaled to the given buffer size 
  // uhh after writing that it sounds super weird I'm sorry I don't remember exactly what it's used for :P
  getHalfWidth(word) {
    return (word.length / 2) * 11;
  }

  drawContent() {
    let self = this;

    // Remove everything from the canvas
    self.svg.selectAll("*").remove();

    // Fixes a weird null error on resizing SVG's, not sure what the cause was but some change in here started it but it
    // was an easy fix with this little null check
    if (self.svg._groups[0][0] === null) {
      return;
    }

    // For every entity given to us, we want to grpah it
    this.entities = self.props.twoDimensionalEntities.map(function (
      entity,
      index
    ) {
      let clientWidth = self.svg._groups[0][0].clientWidth;
      let clientHeight = self.svg._groups[0][0].clientHeight;

      // Neat little trick to deep copy an object, used because we want to keep the shape of an object but scale the values without changing the originals at their references
      let coordInfo = JSON.parse(JSON.stringify(entity.payload.geo.extent));
      let coordSystem = entity.payload.geo.coordinateSystem;
      let range = coordSystem.range;

      let margin = 40;

      if (entity.payload.geo.extent.extentClassName === "rectangle") {
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

        let currEntity = self.getGraphedEntity(
          coordInfo.extentClassName,
          coordInfo,
          self.getOccupancy(index)
        );

        // Add mouseover tooltips
        currEntity.on("mouseover", function () {
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
            .text(function (d) {
              return entity.name;
            });
        });

        currEntity.on("mouseout", function () {
          d3.select(this);
          self.drawContent();
        });

        return currEntity;
      } else if (entity.payload.geo.extent.extentClassName === "polygon") {
        let newVerticies = entity.payload.geo.extent.verticies.map(function (
          verticie
        ) {
          return {
            x: self.scale(
              verticie.x,
              range.xMin,
              range.xMax,
              margin,
              clientWidth - margin
            ),
            y: self.scale(
              verticie.y,
              range.yMin,
              range.yMax,
              margin,
              clientHeight - margin
            ),
          };
        });

        let currEntity = self.getGraphedEntity(
          "polygon",
          newVerticies,
          self.getOccupancy(index)
        );

        return currEntity;
      } else {
        return null;
      }
    });
  }

  render() {
    return (
      <div className="FloorMap">
        <div className="floormap-map-wrapper">
          <svg
            className="floormap-canvas"
            ref={(handle) => (this.svg = d3.select(handle))}
          ></svg>
        </div>
        <div className="floormap-margin"></div>
      </div>
    );
  }
}

export default FloorMap;
