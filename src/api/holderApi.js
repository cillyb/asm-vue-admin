import axios from 'axios';

//获取持有人列表
export const getHolderListPage = params => {
    return axios.post(`/api/bg/users/app-user/holderList`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};
