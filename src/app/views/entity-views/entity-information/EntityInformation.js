import React, { useState, useEffect, useCallback } from "react";
import "./EntityInformation.scss";

import {
  DateTimePicker,
  Picklist,
  PicklistOption,
  CheckboxToggle
} from "react-rainbow-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";

import { NumberFocus } from "app/containers";

import {
  capitalizeWords,
  getMostRecentOccupancyTimestamp,
  getEntityType
} from "globals/utils/formatting-helper";
import { OccupancyButton } from "../../../components";

function EntityInformation(props) {
  const entity = props.entity;

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [realtime, setRealtime] = useState(false);
  const [spinSync, setSpinSync] = useState(false);

  useEffect(() => {
    setSelectedEntity(null);
  }, [props.subEntities]);

  useEffect(() => {
    // Doing this little weird thing as a quick fix 
    // The progress doesn't update as a prop when it goes from 80 => 100
    // This is likely due to the occupancy call being async rather than synchronous 
    setSpinSync(true);
    setTimeout(() => {
      setSpinSync(false);
    }, 1000);
  }, [props.progress]);

  function selectEntity(entitySelection) {
    setSelectedEntity(entitySelection);
    props.selectEntity(entitySelection.value);
  }

  if (entity === undefined) {
    return null;
  }

  return (
    <div className="EntityInformation">
      <h2>Current Date</h2>
      <DateTimePicker
        value={props.currentDate}
        disabled={realtime}
        onChange={value => props.setCurrentDate(value)}
      />

      <div style={{ height: "24px" }} />

      <div className="header-toggle">
        <h2>Date Range</h2>
        <CheckboxToggle
          value={realtime}
          onChange={event => setRealtime(!realtime)}
        />
      </div>
      <div style={{ height: "16px" }} />

      <DateTimePicker
        // label="from"
        value={props.fromDate}
        disabled={!realtime}
        onChange={value => props.setFromDate(value)}
      />
      <div style={{ height: "16px" }} />
      <DateTimePicker
        // label="to"
        value={props.toDate}
        disabled={!realtime}
        onChange={value => props.setToDate(value)}
      />

      <div style={{ height: "24px" }} />

      <h2>Contained Spaces</h2>
      <Picklist
        value={selectedEntity}
        onChange={value => selectEntity(value)}
        placeholder="Select a space"
        disabled={getEntityType(entity) === "cartesian2d"}
      >
        {props.subEntities
          .sort(function(a, b) {
            if (a.name < b.name) return -1;
            if (a.name > b.name) return 1;
            return 0;
          })
          .map(function(entity, index) {
            return (
              <PicklistOption
                key={index}
                name={entity.name}
                label={capitalizeWords(entity.name)}
                value={entity}
              />
            );
          })}
      </Picklist>
      <div style={{ height: "12px" }} />
      {getEntityType(entity) === "cartesian2d" ? (
        <p style={{ textAlign: "center" }}>
          Cannot select a contained entity of a cartesian2d level.
        </p>
      ) : null}

      <div style={{ height: "24px" }} />

      <div className="header-toggle">
        <h2>Occupancy</h2>
        <FontAwesomeIcon
          icon={faSync}
          onClick={() => props.refreshOccupancies()}
          // className="entity-refresh-icon"
          className={"entity-refresh-icon " + (spinSync ? " entity-refresh-spinner" : "")}
        ></FontAwesomeIcon>
      </div>

      <NumberFocus
        subtitle="Occupants"
        lastUpdated={getMostRecentOccupancyTimestamp(props.occupancies)}
      >
        {props.occupancy}
      </NumberFocus>

      <OccupancyButton
        isColored={true}
        className="box-shadow"
        style={{ marginTop: "auto", alignSelf: "center" }}
        onClick={() => props.openDialog(entity, "Detailed Entity View")}
        label="Analytics"
      ></OccupancyButton>
    </div>
  );
}

export default EntityInformation;
