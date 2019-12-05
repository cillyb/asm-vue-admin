import axios from 'axios';

//获取持有人列表
export const getHolderListPage = params => {
    return axios.post(`/bgapi/bg/view/app-user-view/holderList`, params, {
    }).then(res => res.data);
};

export const getHolderCapitalFlow = params => {
    return axios.post(`/bgapi/bg/view/capitalflow-view/getHolderCapitalFlow`, params, {
    }).then(res => res.data);
};

