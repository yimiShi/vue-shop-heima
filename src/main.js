import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'

import './plugins/element'

// font
import './assets/fonts/iconfont.css'
// 全局样式表
import './assets/css/global.css'
import router from './router'

axios.defaults.baseURL = 'http://127.0.0.1:8888/api/private/v1/'
Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
