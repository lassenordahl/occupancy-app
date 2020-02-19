import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import axios from 'axios';
// import app_config from "../../../globals/config";

const auth = {
    authLoginURL: window.location.origin + '/login',
    isAuthenticated: false,
    async verifyOrRedirect() {
        let self = this;
        axios.get(window.location.origin + '/verify')
            .then(function (response) {
                self.isAuthenticated = true
            })
            .catch(function (error) {
                if (!self.isAuthenticated) {
                    window.location.href = self.authLoginURL; 
                }
            });
        return self.isAuthenticated
    },
    async signout() {
        axios.get(window.location.origin + '/logout')
            .then(function (response) {
                console.log(response);
            })
            .catch(function (error) {
                console.log(error);
            });
        this.isAuthenticated = false
    }
}

const PrivateRoute = ({ component: Component, ...rest }) => (
    <Route {...rest} render={(props) => (
        auth.verifyOrRedirect()
        ? <Component {...props} />
        : <Redirect to={{ pathname: '/' }} />
    )} />
)

const AuthButton = () => (
    auth.isAuthenticated ? (
        <p>
        Welcome! <button onClick={() => {
            auth.signout()
        }}>Sign out</button>
        </p>
    ) : (
        <p>You are not logged in. <button href={auth.authLoginURL}>Login</button>
        </p>
    )
)

export default PrivateRoute