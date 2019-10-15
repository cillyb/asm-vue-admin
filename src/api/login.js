import axios from 'axios';

export const requestLogin = params => {
    return axios.post(`/api/login/bgManagerLogin`, params,{
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => res.data);
};