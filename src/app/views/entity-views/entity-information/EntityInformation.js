import React, { useState, useEffect } from "react";
import "./EntityInformation.scss";

import {
  DatePicker,
  Button,
  Picklist,
  PicklistOption,
  CheckboxToggle
} from "react-rainbow-components";

import { NumberFocus } from "app/containers";

import { capitalizeWords } from "globals/utils/formatting-helper";

function EntityInformation(props) {
  const entity = props.entity;

  const [selectedEntity, setSelectedEntity] = useState(null);
  const [realtime, setRealtime] = useState(false);
  const [fromDate] = useState(new Date());
  const [toDate] = useState(new Date());

  useEffect(() => {
    setSelectedEntity(null);
  }, [props.subEntities]);

  function selectEntity(entitySelection) {
    setSelectedEntity(entitySelection);
    props.selectEntity(entitySelection.value);
  }

  if (entity === undefined) {
    return null;
  }

  return (
    <div className="EntityInformation">
      <div className="header-toggle">
        <h2>Date Range</h2>
        <CheckboxToggle
          value={realtime}
          onChange={event => setRealtime(!realtime)}
        />
      </div>
      <DatePicker label="from" value={fromDate} disabled={!realtime} />
      <div style={{ height: "16px" }} />
      <DatePicker label="to" value={toDate} disabled={!realtime} />

      <div style={{ height: "24px" }} />
{/* 
      <h2>Entity Class</h2>
      <p>{entity.entityClassName}</p>

      <div style={{ height: "24px" }} /> */}

      {/* <h2>Entity Type</h2>
      <p>{capitalizeWords(entity.entityTypeName)}</p> */}

      {/* <div style={{ height: "24px" }} /> */}

      <h2>Contained Spaces</h2>
      <Picklist
        value={selectedEntity}
        onChange={value => selectEntity(value)}
        placeholder="Select a space"
      >
        {props.subEntities.map(function(entity, index) {
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

      <div style={{ height: "24px" }} />

      <h2>Occupancy</h2>
      <NumberFocus subtitle="Occupants">{props.occupancy}</NumberFocus>
      {/*       
      
      <h2>Selected Building</h2>
      <SelectedBuilding 
        building={props.building}
        realtime={realtime}
      ></SelectedBuilding>     */}

      <Button
        variant="brand"
        className="box-shadow color-blue"
        style={{ marginTop: "auto", alignSelf: "center" }}
        onClick={() => props.openDialog(entity, "Detailed Entity View")}
        label="Analytics"
      ></Button>
    </div>
  );
}

export default EntityInformation;
