import axios from 'axios';

export const requestLogin = params => {
    return axios.post(`/bgapi/login/bgManagerLogin`, params,{
    }).then(res => res.data);
};