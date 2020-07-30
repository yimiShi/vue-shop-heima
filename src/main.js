import Vue from 'vue'
import App from './App.vue'
import axios from './api/ajax'

import './plugins/element'

// font
import './assets/fonts/iconfont.css'
// 全局样式表
import './assets/css/global.css'
import router from './router'

Vue.prototype.$http = axios

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
