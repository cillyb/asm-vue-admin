import axios from 'axios';

export const getUserListPage = params => {
    return axios.post(`/api/bg/view/app-user-view/list`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const addUser = params => {
    return axios.post(`/api/bg/users/app-user/add`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const editUser = params => {
    return axios.post(`/api/bg/users/app-user/update`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const removeUser = params => {
    return axios.post(`/api/bg/users/app-user/delete`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

//用户状态-开启
export const openUser = params =>{
    return axios.post(`/api/bg/users/app-user/enable`, params, {
        headers :{
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
}

//用户状态-关闭
export const closeUser = params =>{
    return axios.post(`/api/bg/users/app-user/disable`, params, {
        headers :{
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
}