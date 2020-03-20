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
    window.addEventListener("resize", this.drawContent);
  }
  componentDidUpdate() {
    this.drawContent();
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
    let rainbow = getBlueRainbow(this.props.legendMax);

    console.log(entityCoordInfo);

    let self = this;
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
            .map(function(verticie) {
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

  getHalfWidth(word) {
    return (word.length / 2) * 11;
  }

  drawContent() {
    let self = this;

    self.svg.selectAll("*").remove();

    if (self.svg._groups[0][0] === null) {
      return;
    }

    this.entities = self.props.twoDimensionalEntities.map(function(
      entity,
      index
    ) {
      let clientWidth = self.svg._groups[0][0].clientWidth;
      let clientHeight = self.svg._groups[0][0].clientHeight;

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
              return entity.name;
            });
        });

        currEntity.on("mouseout", function() {
          d3.select(this);
          self.drawContent();
        });

        return currEntity;
        return null;
      } else if (entity.payload.geo.extent.extentClassName === "polygon") {
        console.log(entity.payload.geo.extent.verticies);
        let newVerticies = entity.payload.geo.extent.verticies.map(function(
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
            )
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
            ref={handle => (this.svg = d3.select(handle))}
          ></svg>
        </div>
        <div className="floormap-margin"></div>
      </div>
    );
  }
}

export default FloorMap;
