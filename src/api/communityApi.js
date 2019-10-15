import axios from 'axios';

//获取社区列表
export const getCommunityListPage = params => {
    return axios.post(`/api/bg/admin/community/list`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

//删除社区
export const removeCommunity = params => {
    return axios.post(`/api/bg/admin/community/delete`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

//添加社区
export const addCommunity = params => {
    return axios.post(`/api/bg/admin/community/add`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

//修改社区
export const editCommunity = params => {
    return axios.post(`/api/bg/admin/community/update`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

//手机验证
export function isvalidPhone(str) {
    const reg = /^1[3|4|5|7|8][0-9]\d{8}$/
    return reg.test(str)
}