import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Index from './views/Index.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Form from './views/nav1/Form.vue'
import user from './views/nav1/user.vue'
import Application from './views/nav2/Application.vue'
import Page4 from './views/nav2/Page4.vue'
import Page5 from './views/nav2/Page5.vue'
import SysLog from './views/nav3/SysLog.vue'
import AdminLog from './views/nav3/AdminLog.vue'
import UserLog from './views/nav3/UserLog.vue'
import GuidePageConfig from './views/nav4/GuidePageConfig.vue'
import IntegralConfig from './views/nav4/IntegralConfig.vue'
import SubscribeConfig from './views/nav4/SubscribeConfig.vue'
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
        iconCls: 'el-icon-menu',
        leaf: true,//只有一个节点
        children: [
            { path: '/Index', component: Index, name: '首页' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '用户管理',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/userList', component: userList, name: '用户列表' },
            { path: '/userLevel', component: userLevel, name: '用户等级' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '持有人管理',
        iconCls: 'el-icon-menu',
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
        iconCls: 'el-icon-menu',
        children: [
            { path: '/communityList', component: communityList, name: '社区列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '设置管理',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/deviceTypeSetting', component: deviceTypeSetting, name: '设备类型设置' },
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
        iconCls: 'el-icon-menu',
        children: [
            { path: '/deviceList', component: deviceList, name: '设备列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '监控管理',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/monitorList', component: monitorList, name: '监控列表' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '交易管理',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/orderManager', component: orderManager, name: '订单管理' },
            { path: '/refundManager', component: refundManager, name: '退款管理' }
        ]
    },
    {
        path: '/',
        component: Home,
        name: '统计管理',
        iconCls: 'el-icon-menu',
        children: [
            { path: '/statisticalGraph', component: statisticalGraph, name: '统计图表' }
        ]
    },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '',
    //     iconCls: 'el-icon-menu',//图标样式class
    //     leaf: true,//只有一个节点
    //     children: [
    //         // { path: '/main', component: Main, name: '主页', hidden: true },
    //         { path: '/Application', component: Application, name: '应用管理' },
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '日志管理',
    //     iconCls: 'el-icon-menu',
    //     children: [
    //         { path: '/SysLog', component: SysLog, name: '系统日志' },
    //         { path: '/AdminLog', component: AdminLog, name: '管理员操作日志' },
    //         { path: '/UserLog', component: UserLog, name: '用户使用日志' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '配置管理',
    //     iconCls: 'el-icon-menu',
    //     children: [
    //         { path: '/GuidePageConfig', component: GuidePageConfig, name: '引导页配置' },
    //         { path: '/IntegralConfig', component: IntegralConfig, name: '积分规则配置' },
    //         { path: '/SubscribeConfig', component: SubscribeConfig, name: '订阅栏目配置' },
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '权限管理',
    //     iconCls: 'el-icon-menu',
    //     children: [
    //         { path: '/page4', component: Page4, name: '权限组管理' },
    //         { path: '/Main', component: Main, name: '权限组权限管理' },
    //         { path: '/Form', component: Form, name: '权限组人员管理' }
    //     ]
    // },
    // {
    //     path: '/',
    //     component: Home,
    //     name: '账号管理',
    //     iconCls: 'el-icon-menu',
    //     children: [
    //         { path: '/user', component: user, name: '页面4' },
    //         { path: '/page5', component: Page5, name: '页面5' }
    //     ]
    // },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;