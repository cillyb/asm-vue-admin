import axios from 'axios';



//获取分利列表
export const getShareholdingListPage = params => {
    return axios.post(`/bgapi/bg/assets/shareholding-model/list`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//删除分利
export const removeShareholding = params => {
    return axios.post(`/bgapi/bg/assets/shareholding-model/delete`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//添加分利
export const addShareholding = params => {
    return axios.post(`/bgapi/bg/assets/shareholding-model/add`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//修改分利
export const editShareholding = params => {
    return axios.post(`/bgapi/bg/assets/shareholding-model/update`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//验证分利的百分比
export function isvalidSharing(number) {
    return !(number < 0 || number > 100);
}
//验证每月结算日
export function isvalidDate(number) {
    return !(number < 1 || number > 28);
}



////获取预约时间列表
export const getTimeModelListPage = params => {
    return axios.post(`/bgapi/bg/assets/appoint-model/list`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//删除预约时间
export const removeTimeModel = params => {
    return axios.post(`/bgapi/bg/assets/appoint-model/delete`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//添加预约时间
export const addTimeModel = params => {
    return axios.post(`/bgapi/bg/assets/appoint-model/add`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//修改预约时间
export const editTimeModel = params => {
    return axios.post(`/bgapi/bg/assets/appoint-model/update`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//验证输入的价格
export function isvalidDay(number) {
    return number > 0;
}
//验证输入的时长
export function isvalidTime(number) {
    return number % 1 === 0 && number > 0;
}



//获取价格模板列表
export const getPriceModelListPage = params => {
    return axios.post(`/bgapi/bg/view/price-model-view/list`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//删除价格模板
export const removePriceModel = params => {
    return axios.post(`/bgapi/bg/assets/price-model/delete`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//添加价格模板
export const addPriceModel = params => {
    return axios.post(`/bgapi/bg/assets/price-model/add`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//修改价格模板
export const editPriceModel = params => {
    return axios.post(`/bgapi/bg/assets/price-model/update`, params, {
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
};
//验证输入的价格
export function isvalidPrice(number) {
    return number >= 0;
}
//验证输入的时长
export function isvalidUnitCount(number) {
    return number % 1 === 0 && number > 0;
}



//预约模板状态-开启
export const openTimeModel = params =>{
    return axios.post(`/bgapi/bg/assets/appoint-model/enable`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}

//预约模板状态-关闭
export const closeTimeModel = params =>{
    return axios.post(`/bgapi/bg/assets/appoint-model/disable`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}



//价格模板状态-开启
export const openPriceModel = params =>{
    return axios.post(`/bgapi/bg/assets/price-model/enable`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}

//价格模板状态-关闭
export const closePriceModel = params =>{
    return axios.post(`/bgapi/bg/assets/price-model/disable`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}



//分利模板状态-开启
export const openShareholding = params =>{
    return axios.post(`/bgapi/bg/assets/shareholding-model/enable`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}

//分利模板状态-关闭
export const closeShareholding = params =>{
    return axios.post(`/bgapi/bg/assets/shareholding-model/disable`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}



//获取交易设置
export const getOrderSettingListPage = params =>{
    return axios.post(`/bgapi/bg/settings/orders-setting/getOrderSetting`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}

//修改交易设置
export const editOrderSetting = params =>{
    return axios.post(`/bgapi/bg/settings/orders-setting/update`, params, {
        headers :{
            'Content-Type': 'application/json',
        }
    }).then(res => res.data);
}