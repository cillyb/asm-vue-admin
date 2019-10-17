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
//验证分利的百分比
export function isvalidSharing(number) {
    return !(number < 0 || number > 100);
}



////获取预约时间列表
export const getTimeModelListPage = params => {
    return axios.post(`/api/bg/assets/appoint-model/list`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};
//删除预约时间
export const removeTimeModel = params => {
    return axios.post(`/api/bg/assets/appoint-model/delete`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};
//添加预约时间
export const addTimeModel = params => {
    return axios.post(`/api/bg/assets/appoint-model/add`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};
//修改预约时间
export const editTimeModel = params => {
    return axios.post(`/api/bg/assets/appoint-model/update`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
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
    return axios.post(`/api/bg/view/price-model-view/list`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};
//删除价格模板
export const removePriceModel = params => {
    return axios.post(`/api/bg/assets/appoint-model/delete`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};
//添加价格模板
export const addPriceModel = params => {
    return axios.post(`/api/bg/assets/price-model/add`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};
//修改价格模板
export const editPriceModel = params => {
    return axios.post(`/api/bg/assets/price-model/update`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
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