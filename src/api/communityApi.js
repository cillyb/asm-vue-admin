import axios from 'axios';

//获取社区列表
export const getCommunityListPage = params => {
    return axios.post(`/api/bg/view/community-view/list`, params, {
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
    const reg = /^1[3|4|5|6|7|8][0-9]\d{8}$/
    return reg.test(str)
}
export function isvalidTel(str){
    var tel = str;
    if(!/^([0-9]{3,4}-)?[0-9]{7,8}$/.test(tel)){
        return false;
    }
    return true;
}
//社区状态-开启
export const openCommunity = params =>{
    return axios.post(`/api/bg/admin/community/enable`, params, {
        headers :{
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
}

//社区状态-关闭
export const closeCommunity = params =>{
    return axios.post(`/api/bg/admin/community/disable`, params, {
        headers :{
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
}
