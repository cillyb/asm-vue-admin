import axios from 'axios';

//获取监控列表
export const getMonitorListPage = params => {
    return axios.post(`/api/bg/view/asset-view/list`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};

//上架
export const openStatus = params =>{
    return axios.post(`/api/bg/assets/asset/enable`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}

//下架
export const closeStatus = params =>{
    return axios.post(`/api/bg/assets/asset/disable`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}

//可预约
export const openIsCanBook = params =>{
    return axios.post(`/api/bg/assets/asset/enableBook`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}

//不可预约
export const closeIsCanBook = params =>{
    return axios.post(`/api/bg/assets/asset/disableBook`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}

export const getLogs = params =>{
    return axios.post(`/api/bg/view/log-view/list`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}