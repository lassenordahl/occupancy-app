import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';

async function verifyOrRedirect(auth) {
    if (Cookies.get('access-token')) {
        auth.setAuthStatus(true)
    }
    else {
        try {
            await axios.get(window.location.origin + '/verify');
            auth.setAuthStatus(true);
            return auth.authStatus;
        }
        catch(error) {
            auth.setAuthStatus(false)
            window.location.href = '/home'; 
        }
    }
    return auth.authStatus
}

const PrivateRoute = ({ component: Component, auth: authStatus, ...rest }) => (
    <Route {...rest} render={(props) => (
        verifyOrRedirect(authStatus)
        ? <Component {...props} />
        : <Redirect to='/home' />
    )} />
)

export default PrivateRoute