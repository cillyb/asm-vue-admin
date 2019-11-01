import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Index from './views/Index.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
//
import userList from './views/userManager/userList.vue'
import userLevel from './views/userManager/userLevel.vue'
import holderList from './views/holderManager/holderList.vue'
import holderLevel from './views/holderManager/holderLevel.vue'
import holderFundsFlow from './views/holderManager/holderFundsFlow.vue'
import communityList from './views/communityManager/communityList.vue'
import deviceTypeSetting from './views/settingManager/deviceTypeSetting.vue'
import appointmentTimeSetting from './views/settingManager/appointmentTimeSetting.vue'
import priceSetting from './views/settingManager/priceSetting.vue'
import shareholdingSetting from './views/settingManager/shareholdingSetting.vue'
import businessSetting from './views/settingManager/businessSetting.vue'
import deviceList from './views/deviceManager/deviceList.vue'
import monitorList from './views/monitorManager/monitorList.vue'
import orderManager from './views/businessManager/orderManager.vue'
import refundManager from './views/businessManager/refundManager.vue'
import statisticalGraph from './views/statisticsManager/statisticalGraph.vue'
import logList from './views/monitorManager/logList.vue'

let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },
    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: '',
        iconCls: 'iconfont icon-shouye',
        leaf: true,//只有一个节点
        children: [
            { path: '/Index', component: Index, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'iconfont icon-yonghu',
        children: [
            { path: '/userList', component: userList, name: '用户列表' },
            { path: '/userLevel', component: userLevel, name: '用户等级' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '持有人管理',
        iconCls: 'iconfont icon-yonghuguanli',
        children: [
            { path: '/holderList', component: holderList, name: '持有人列表' },
            { path: '/holderLevel', component: holderLevel, name: '持有人等级' },
            { path: '/holderFundsFlow', component: holderFundsFlow, name: '持有人资金流水' }

        ]
    },
    {
        path: '/',
        component: Home,
        name: '社区管理',
        iconCls: 'iconfont icon-jiudian',
        children: [
            { path: '/communityList', component: communityList, name: '社区列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '设置管理',
        iconCls: 'iconfont icon-shezhi',
        children: [
            // { path: '/deviceTypeSetting', component: deviceTypeSetting, name: '设备类型设置' },
            { path: '/appointmentTimeSetting', component: appointmentTimeSetting, name: '预约时间设置' },
            { path: '/priceSetting', component: priceSetting, name: '价格设置' },
            { path: '/shareholdingSetting', component: shareholdingSetting, name: '分利设置' },
            { path: '/businessSetting', component: businessSetting, name: '交易设置' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '设备管理',
        iconCls: 'iconfont icon-shebeiguanli',
        children: [
            { path: '/deviceList', component: deviceList, name: '设备列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '监控管理',
        iconCls: 'iconfont icon-jiankong',
        children: [
            { path: '/monitorList', component: monitorList, name: '监控列表' },
            { path: '/logList', component: logList, name: '日志列表' }

        ]
    },
    {
        path: '/',
        component: Home,
        name: '交易管理',
        iconCls: 'iconfont icon-jiaoyishuju',
        children: [
            { path: '/orderManager', component: orderManager, name: '订单管理' },
            { path: '/refundManager', component: refundManager, name: '退款管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '统计管理',
        iconCls: 'iconfont icon-tongji',
        children: [
            { path: '/statisticalGraph', component: statisticalGraph, name: '统计图表' }
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;