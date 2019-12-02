import babelpolyfill from 'babel-polyfill'
import Vue from 'vue'
import App from './App'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
//import './assets/theme/theme-green/index.css'
import VueRouter from 'vue-router'
import store from './vuex/store'
import Vuex from 'vuex'
//import NProgress from 'nprogress'
//import 'nprogress/nprogress.css'
import routes from './routes'

import axios from 'axios';
// import Mock from './mock'
// Mock.bootstrap();
import 'font-awesome/css/font-awesome.min.css'

Vue.use(ElementUI)
Vue.use(VueRouter)
Vue.use(Vuex)

//NProgress.configure({ showSpinner: false });

const router = new VueRouter({
  routes
})

// http request 拦截器
axios.interceptors.request.use(
    config => {
      // console.log("拦截器拦截了请求: ");
      // console.log(config);
      if (localStorage.user) { //判断token是否存在
        config.headers['X-BG-TOKEN'] = localStorage.user;  //将token设置成请求头
      }
      return config;
    },
    err => {
      return Promise.reject(err);
    }
);


// http response 拦截器
axios.interceptors.response.use(
    response => {
      // console.log("拦截器拦截了响应：")
      // console.log(response);
      if (response.data.meta.code === '10002') {
        console.log("token过期");
        router.replace('/login');
      }
      return response;
    },
    error => {
      return Promise.reject(error);
    }
);


router.beforeEach((to, from, next) => {
  //NProgress.start();
  if (to.path == '/login') {
    localStorage.removeItem('user');
  }
  let user = JSON.parse(localStorage.getItem('user'));
  if (!user && to.path != '/login') {
    next({ path: '/login' })
  } else {
    next()
  }
})

//router.afterEach(transition => {
//NProgress.done();
//});

new Vue({
  //el: '#app',
  //template: '<App/>',
  router,
  store,
  //components: { App }
  render: h => h(App)
}).$mount('#app')

