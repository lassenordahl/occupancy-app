import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import axios from 'axios';

async function verifyOrRedirect(auth) {
    axios.get(window.location.origin + '/verify')
        .then(function (response) {
            auth.setAuthStatus(true)
        })
        .catch(function (error) {
            auth.setAuthStatus(false)
            window.location.href = '/home'; 
        });
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