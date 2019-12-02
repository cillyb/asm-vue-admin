import axios from 'axios';

export const getUserListPage = params => {
    return axios.post(`/bgapi/bg/view/app-user-view/list`, params, {
    }).then(res => res.data);
};

export const addUser = params => {
    return axios.post(`/bgapi/bg/users/app-user/add`, params, {
    }).then(res => res.data);
};

export const editUser = params => {
    return axios.post(`/bgapi/bg/users/app-user/update`, params, {
    }).then(res => res.data);
};

export const removeUser = params => {
    return axios.post(`/bgapi/bg/users/app-user/delete`, params, {
    }).then(res => res.data);
};

//用户状态-开启
export const openUser = params =>{
    return axios.post(`/bgapi/bg/users/app-user/enable`, params, {
    }).then(res => res.data);
}

//用户状态-关闭
export const closeUser = params =>{
    return axios.post(`/bgapi/bg/users/app-user/disable`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}