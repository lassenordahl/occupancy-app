import React from 'react'
import {
  Route,
  Redirect
} from 'react-router-dom'
import axios from 'axios';
import Cookies from 'js-cookie';

// async function verifyOrRedirect(auth) {
//     if (Cookies.get('access-token')) {
//         auth.setAuthStatus(true);
//         return true;
//     }
//     else {
//         try {
//             await axios.get(window.location.origin + '/verify');
//             auth.setAuthStatus(true);
//             return true;
//         }
//         catch(error) {
//             auth.setAuthStatus(false)
//             return false;
//         }
//     }
// }

// const initialState = {loading: false, verified: false};

// function reducer(state, action) {
//     switch (action.type) {
//         case 'init':
//             return {loading: true, verified: false};
//         case 'loading':
//             console.log('UPDATED LOAD', action)
//             return {loading: action.value, verified: state.verified};
//         case 'verified':
//             console.log('UPDATED VERI', action)
//             return {loading: state.verified, verified: action.value};
//         default:
//             throw new Error();
//     }
// }

class PrivateRoute extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {loading: true, verified: false};
    }
    async componentDidMount() {
        try {
            if (Cookies.get('access-token')) {
                this.props.auth.setAuthStatus(true);
                this.setState({loading: false, verified: true});
            }
            else {
                this.props.auth.setAuthStatus(true);
                this.setState({loading: false, verified: true});
                await axios.get(window.location.origin + '/verify');
            }
        } catch (error) {
            this.props.auth.setAuthStatus(false);
            this.setState({loading: false, verified: false});
        }
    }
    render() {
        let { component: Component, auth: authStatus, ...rest } = this.props;
        if (this.state.loading) {
            return (<div>loading</div>);
        }
        else if (!this.state.verified) {
            return (<Redirect to='/home' />);
        }
        else {
            return (<Route {...rest} render={(props) => (<Component {...props} /> )} />);
        }
      }
}


// const PrivateRoute = ({ component: Component, auth: authStatus, ...rest }) => {
//     const [ verifyRequest, setVerifyRequest ] = useState({loading: false, verified: false})
    
    

//     useEffect(() => {
//         // let didCancel = false
//         // Create an scoped async function in the hook
//         async function anyNameFunction() {
//             setVerifyRequest({loading: true, verified: false});             
//             try {
//                 if (!Cookies.get('access-token')) {
//                     let result = await axios.get(window.location.origin + '/verify');
//                     console.log('RESULT', result);
//                 }
//                 setVerifyRequest({loading: false, verified: true});
//                 console.log('isVerified.......1', verifyRequest)
//             }
//             catch(error) {
//                 // authStatus.setAuthStatus(false)
//                 setVerifyRequest({loading: false, verified: false});
//                 console.log('isVerified.......2', verifyRequest)
//             }
//         }
//         // Execute the created function directly
//         anyNameFunction();
//         // return () => { didCancel = true }
//       }, [verifyRequest]);

//       const { isLoading, isVerified } = verifyRequest;


    // const [state, dispatch] = useReducer(reducer, initialState);
    // const isMounted = useRef(false);

    // useEffect(() => {
    //     isMounted.current = true;
    //     return () => { isMounted.current = false; }
    //   }, []);
    
    // useEffect(() => {
    //     async function fetch (vars) {
    //         // if (!isMounted.current) return; 
    //         dispatch({ type: 'init' });
        
    //         try {
    //             await axios.get(window.location.origin + '/verify');
    //              dispatch({ type: 'verified', value: true });
    //         } catch (e) {
    //              dispatch({ type: 'verified', value: false });
    //         }
    //         finally {
    //             dispatch({ type: 'loading', value: false });
    //         }
    //     } 
    //     fetch();
    // }, [state]); 
    // console.log(state);
    // if (state.loading) {
    //     console.log('loading..', state.loading)
    //     return (<div>loading</div>);
    // }
    // else if (!state.verified) {
    //     console.log('is not verified..', state.verified)
    //     return (<Redirect to='/home' />);
    // }
    // else {
    //     console.log('is verified..', state.verified);
    //     return (<Route {...rest} render={(props) => (<Component {...props} /> )} />);
    // }
    // const [ isLoading, setIsLoading ] = useState(false)
    // const [ isVerified, setIsVerified ] = useState(false)
    // // // const [ isVerified, setIsVerified ] = useState(false)
    
    // useEffect(() => {
    //     // let didCancel = false
    //     // Create an scoped async function in the hook
    //     async function anyNameFunction() {
    //         setIsLoading(true);             
    //         try {
    //             if (!Cookies.get('access-token')) {
    //                 let result = await axios.get(window.location.origin + '/verify');
    //                 console.log('RESULT', result);
    //             }
    //             // authStatus.setAuthStatus(true);
    //             setIsVerified(true);
    //             console.log('isVerified.......1', isVerified)
    //         }
    //         catch(error) {
    //             // authStatus.setAuthStatus(false)
    //             setIsVerified(false);
    //         }
    //         finally {
    //             console.log('isVerified', isVerified)
    //             setIsLoading(false); 
    //         }
    //     }
    //     // Execute the created function directly
    //     anyNameFunction();
    //     // return () => { didCancel = true }
    //   }, []);

    // return isLoading ? (<div>loading</div>) : (!isVerified ? (<Redirect to='/home' />) : (<Route {...rest} render={(props) => (<Component {...props} /> )} />));
    // authStatus.setAuthStatus(isVerified);

//     if (isLoading) {
//         console.log('loading..', isLoading)
//         return (<div>loading</div>);
//     }
//     else if (!isVerified) {
//         console.log('is not verified..', isVerified)
//         return (<Redirect to='/home' />);
//     }
//     else {
//         console.log('is verified..', isVerified);
//         return (<Route {...rest} render={(props) => (<Component {...props} /> )} />);
//     }
// }

export default PrivateRoute