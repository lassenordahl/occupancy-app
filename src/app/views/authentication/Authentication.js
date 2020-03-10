import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';

class PrivateRoute extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {loading: true, verified: false};
    }
    async componentDidMount() {
        try {
            if (!Cookies.get('access-token')) {
                await axios.get(window.location.origin + '/verify');
            }
            this.props.auth.setAuthStatus(true);
            this.setState({loading: false, verified: true});
        } 
        catch (error) {
            this.props.auth.setAuthStatus(false);
            this.setState({loading: false, verified: false});
        }
    }
    render() {
        let { component: Component, auth: authStatus, ...rest } = this.props;
        if (this.state.loading) {
            return (
                <div className="flex-center" style={{'width': '100%', 'height': '100%'}}>
                    <p>
                        Loading authentication status...
                    </p>
                </div>
            );
        }
        else if (!this.state.verified) {
            return (<Redirect to='/home' />);
        }
        else {
            return (<Route {...rest} render={(props) => (<Component {...props} /> )} />);
        }
      }
}

export default PrivateRoute