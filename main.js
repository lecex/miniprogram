import Vue from 'vue'
import App from './App'
import store from './store'
import * as filters from './filters' // global filters

Vue.config.productionTip = false
Vue.prototype.$store = store

App.mpType = 'app'

// 引入全局uView
import uView from 'uview-ui';
Vue.use(uView);

store.dispatch('setU', Vue.prototype.$u)

// register global utility filters
Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
})
// 引入uView对小程序分享的mixin封装
let mpShare = require('uview-ui/libs/mixin/mpShare.js');
Vue.mixin(mpShare);

const app = new Vue({
    store,
    ...App
})

// http拦截器，将此部分放在new Vue()和app.$mount()之间，才能App.vue中正常使用
import httpInterceptor from '@/common/http.interceptor.js';
Vue.use(httpInterceptor, app);

// http接口API抽离，免于写url或者一些固定的参数
import httpApi from '@/common/http.api.js';
Vue.use(httpApi, app);

// import routeIntercept from '@/common/route.interceptor.js';
// Vue.use(routeIntercept, app);

app.$mount()
