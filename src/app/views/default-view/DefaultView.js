import React from "react";
import "./DefaultView.scss";
import { Button } from 'react-rainbow-components';

function redirectLoginOrSignup(login) {
  if (login) {
    window.location.href = '/login'; 
  }
  else {
    window.location.href = '/signup'; 
  }
}

function DefaultView() {
  return (
    <div class="DefaultView">
      <div class="block">
        <h1>Welcome to the TIPPERS Occupancy Tool!</h1>
        <div>Please login or signup with your TIPPERS account to continue:</div>
        <Button
        variant="brand"
        className="box-shadow"
        style={{'margin': '1.5rem', 'alignSelf': 'center'}}
        onClick={() => redirectLoginOrSignup(true)}
        label="Login"
        >
        </Button>
        <Button
          variant="brand"
          className="box-shadow color-blue"
          style={{'margin': '1.5rem', 'alignSelf': 'center'}}
          onClick={() => redirectLoginOrSignup(false)}
          label="Signup"
        >
        </Button>
      </div>
    </div>
  );
}

export default DefaultView;
