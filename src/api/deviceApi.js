import axios from 'axios';

export const getTypeTree = params => {
    return axios.post(`/bgapi/bg/assets/asset-type/showTypeTree`, params, {
        headers: {
        }
    }).then(res => res.data);
};

export const getDevices = params => {
    return axios.post(`/bgapi/bg/view/asset-view/list`, params, {
        headers: {
        }
    }).then(res => res.data);
};

export const getHolderDevices = params => {
    return axios.post(`/bgapi/bg/view/app-user-assetbenefit/list`, params, {
        headers: {
        }
    }).then(res => res.data);
};

export const removeDevice = params => {
    return axios.post(`/bgapi/bg/assets/asset/delete`, params, {
        headers: {
        }
    }).then(res => res.data);
};

export const updateTypeName = params => {
    return axios.post(`/bgapi/bg/assets/asset-type/update`, params, {
        headers: {
        }
    }).then(res => res.data);
};

export const addTypeName = params => {
    return axios.post(`/bgapi/bg/assets/asset-type/add`, params, {
        headers: {
        }
    }).then(res => res.data);
};

export const removeTypeName = params => {
    return axios.post(`/bgapi/bg/assets/asset-type/delete`, params, {
        headers: {
        }
    }).then(res => res.data);
};

export const addDevice = params => {
    return axios.post(`/bgapi/bg/assets/asset/add`, params, {
        headers: {
        }
    }).then(res => res.data);
};

export const updateDevice = params => {
    return axios.post(`/bgapi/bg/assets/asset/update`, params, {
        headers: {
        }
    }).then(res => res.data);
};

export const getTypeTreeRoute = params => {
    return axios.post(`/bgapi/bg/assets/asset-type/getAssetTreeRoute`, params, {
        headers: {
        }
    }).then(res => res.data);
};

export const getAssetErweimaUrl = params => {
    return axios.post(`/bgapi/bg/assets/asset/showAssetErweimaUrl`, params, {
        headers: {
        }
    }).then(res => res.data);
};


