import axios from 'axios';

//获取分利列表
export const getShareholdingListPage = params => {
    return axios.post(`/api/bg/assets/shareholding-model/list`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

//删除分利
export const removeShareholding = params => {
    return axios.post(`/api/bg/assets/shareholding-model/delete`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

//添加分利
export const addShareholding = params => {
    return axios.post(`/api/bg/assets/shareholding-model/add`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

//修改分利
export const editShareholding = params => {
    return axios.post(`/api/bg/assets/shareholding-model/update`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export function isvalidSharing(number) {
    if(number < 0 || number > 100)
        return false;
    else
        return true;
}