import React, { useState, useEffect } from "react";
import "./EntityInformation.scss";

import {
  DateTimePicker,
  Picklist,
  PicklistOption,
} from "react-rainbow-components";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSync } from "@fortawesome/free-solid-svg-icons";

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
      <h2 style={{marginBottom: '16px'}}>Current Date</h2>
      <DateTimePicker
        value={props.currentDate}
        disabled={props.realtime}
        onChange={value => {
          props.setCurrentDate(value);
          props.refreshOccupancies();
        }}
      />
      <div style={{ height: "16px" }} />

      <div className="header-toggle">
        <h2>Date Range</h2>
        {/* <CheckboxToggle
          value={props.realtime}
          onChange={event => props.setRealtime(!props.realtime)}
        /> */}
      </div>
      <div style={{ height: "16px" }} />
      <DateTimePicker
        // label="from"
        value={props.fromDate}
        disabled={!props.realtime}
        onChange={value => props.setFromDate(value)}
      />
      <div style={{ height: "16px" }} />
      <DateTimePicker
        // label="to"
        value={props.toDate}
        disabled={!props.realtime}
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
      <div style={{ height: "16px" }} />

      {getEntityType(entity) === "cartesian2d" ? (
        <React.Fragment>
          <p style={{ textAlign: "center" }}>
            Cannot select a contained entity of a cartesian2d level.
          </p>
          <div stsyle={{ height: "24px" }}></div>
        </React.Fragment>
      ) : null}

      <div className="header-toggle">
        <h2>Occupancy</h2>
        <FontAwesomeIcon
          icon={faSync}
          onClick={() => props.refreshOccupancies()}
          // className="entity-refresh-icon"
          className={
            "entity-refresh-icon " + (spinSync ? " entity-refresh-spinner" : "")
          }
        ></FontAwesomeIcon>
      </div>
      <div style={{ height: "16px" }} />

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
        onClick={() => props.openDialog(entity, "Analytics")}
        label="Analytics"
      ></OccupancyButton>
    </div>
  );
}

export default EntityInformation;
