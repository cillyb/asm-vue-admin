import axios from "axios";

export const getLogs = params => {
    return axios.post(`/api/bg/view/log-view/list`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};