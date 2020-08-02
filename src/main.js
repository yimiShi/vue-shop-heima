import Vue from 'vue'
import App from './App.vue'
import axios from './api/ajax'
import TreeTable from 'vue-table-with-tree-grid'

import './plugins/element'
import './filters/dateFormat'

// font
import './assets/fonts/iconfont.css'
// 全局样式表
import './assets/css/global.css'
import router from './router'
import BreadCrumb from './components/BreadCrumb/BreadCrumb'

Vue.component('BreadCrumb', BreadCrumb)
Vue.component('tree-table', TreeTable)


Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
