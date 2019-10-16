import axios from 'axios';

export const getTypeTree = params => {
    return axios.post(`/api/bg/assets/asset-type/showTypeTree`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const getDevices = params => {
    return axios.post(`/api/bg/assets/asset/list`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const removeDevice = params => {
    return axios.post(`/api/bg/assets/asset/delete`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};