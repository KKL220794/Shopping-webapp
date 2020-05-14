import {APIURL} from '../../backend';

export const signup = (user) => {
   return fetch(`${APIURL}/signup`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then((response) => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
        
    })
}

export const signin = (user) => {
    return fetch(`${APIURL}/signin`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'content-type': 'application/json'
        },
        body: JSON.stringify(user)
    })
    .then((response) => {
        return response.json();
    })
    .catch(err => {
        console.log(err);
        
    })
}

export const authenticate = (data, next) => {
    if (typeof window !== undefined) {
        localStorage.setItem('jwt', JSON.stringify(data));
        next();
    }
}

export const signout = (next) => {
    if (typeof window !== undefined) {
        localStorage.removeItem('jwt');
        next();

        return fetch(`${APIURL}/signout`, {
            method: 'GET',
        })
        .then(resp => console.log('signout success'))
        .catch(err => console.log(err))
    }
}

export const isAuthenticated  = () => {
    if (window === undefined) {
        return false;
    }
    if (localStorage.getItem('jwt')) {
        return JSON.parse(localStorage.getItem('jwt'))
    } else {
        return false;
    }
}