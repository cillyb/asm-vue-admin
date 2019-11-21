import axios from 'axios';

export const getTypeTree = params => {
    return axios.post(`/api/bg/assets/asset-type/showTypeTree`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const getDevices = params => {
    return axios.post(`/api/bg/view/asset-view/list`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const getHolderDevices = params => {
    return axios.post(`/api/bg/view/app-user-assetbenefit/list`, params, {
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

export const updateTypeName = params => {
    return axios.post(`/api/bg/assets/asset-type/update`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const addTypeName = params => {
    return axios.post(`/api/bg/assets/asset-type/add`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const removeTypeName = params => {
    return axios.post(`/api/bg/assets/asset-type/delete`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const addDevice = params => {
    return axios.post(`/api/bg/assets/asset/add`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const updateDevice = params => {
    return axios.post(`/api/bg/assets/asset/update`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const getTypeTreeRoute = params => {
    return axios.post(`/api/bg/assets/asset-type/getAssetTreeRoute`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

export const getAssetErweimaUrl = params => {
    return axios.post(`/api/bg/assets/asset/showAssetErweimaUrl`, params, {
        headers: {
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};


