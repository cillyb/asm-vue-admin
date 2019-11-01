import axios from 'axios';

//获取订单列表
export const getOrderListPage = params => {
    return axios.post(`/api/bg/view/order-view/list`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};

//获取退款列表
export const getRefundListPage = params => {
    return axios.post(`/api/bg/view/refund-view/list`, params, {
        headers: {
            'Content-Type': 'application/json',
            'X-BG-TOKEN': 1
        }
    }).then(res => res.data);
};