import axios from 'axios';

//获取订单列表
export const getOrderListPage = params => {
    return axios.post(`/bgapi/bg/view/order-view/list`, params, {
    }).then(res => res.data);
};

//获取退款列表
export const getRefundListPage = params => {
    return axios.post(`/bgapi/bg/view/refund-view/list`, params, {
    }).then(res => res.data);
};