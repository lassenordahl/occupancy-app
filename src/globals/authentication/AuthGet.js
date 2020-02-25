import axios from "axios";
import Cookies from 'js-cookie';

function getConfig(args) {
    let token = Cookies.get('access-token')
    if (token) {
        let config = {
            headers: { Authorization: `Bearer ${token}` }
        };
        if (args) {
            config = Object.assign({}, config, args)
        }
        return config
    }
    else {
        window.location.href = '/home'; 
    }
}


async function verifyOrRedirect() {
    try {
        await axios.get(window.location.origin + '/verify');
    }
    catch(error) {
        window.location.href = '/home'; 
    }
}


async function authGet(url, args) {
    let config = {}//getConfig(args)
    try {
        let response = await axios.get(url, config);
        return response;
    }
    catch(error) {
        if (error.response.status === 401) {
            verifyOrRedirect();
            config = getConfig(args);
            try {
                let response = await axios.get(url, config);
                return response;
            }
            catch(error) {
                console.error(error)
                window.location.href = '/home'; 
            }
        }
        else {
            console.error(error)
            return error
        }
    }
    // axios.get(url, config)
    //     .then(function(response) {
    //         console.log('INSIDE', response)
    //         return response;
    //     })
    //     .catch(function(response){
    //         verifyOrRedirect();
    //         // Try one more time with refreshed token, else redirect home
    //         config = getConfig(args)
    //         axios.get(url, config)
    //             .then(function(response) {
    //                 return response;
    //             })
    //             .catch(function(response){
    //                 window.location.href = '/home'; 
    //             })
    //     });
}

export default authGet