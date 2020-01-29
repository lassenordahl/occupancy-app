import React, {useState} from "react";
import './HistoricalGeo.scss';

import { DatePicker, Button } from 'react-rainbow-components';
import { Trail } from 'react-spring/renderprops';

import { 
  FloorRow
} from 'app/components';

function HistoricalGeo(props) {

  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());

  return (
    <div className="HistoricalGeo">
      <h2>
        Date Range
      </h2>
      <div className="date-input">
        <h3>From: </h3>
        <DatePicker
          value={fromDate}
          onChange={(date) => setFromDate(date)}
        ></DatePicker>
      </div>
      <div className="date-input">
        <h3>To: </h3>
        <DatePicker
          value={toDate}
          onChange={(date) => setToDate(date)}
        ></DatePicker>
      </div>
      <h2>
        Selected Floors
      </h2>
      { props.building !== null ?
        <Trail
          items={[...Array(props.building.floorCount).keys()]}
          keys={item => item} 
          from={{opacity: 0}} 
          to={{opacity: 1}}
          duration={4000}
        >
          {item => props => 
            <FloorRow style={props} floorNumber={item}></FloorRow>
          }
        </Trail> 
        :
          <p> No building selected</p>
      }
      <div style={{'flex': '1 1 '}}></div>
      <Button
        variant="brand"
        className="box-shadow color-blue"
        style={{'alignSelf': 'center'}}
        // onClick={() => props.openDialog('')}
        label="Show Map Data"
      >
      </Button>
    </div>
  );
}

export default HistoricalGeo;
