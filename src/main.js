import Vue from 'vue'
import App from './App.vue'
import axios from './api/ajax'
import TreeTable from 'vue-table-with-tree-grid'

// 富文本编辑器
import VueQuillEditor from 'vue-quill-editor'
// 富文本编辑器对应的样式
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

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

// 将富文本编辑区注册成全局组件
Vue.use(VueQuillEditor)


Vue.prototype.$http = axios
Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App),
}).$mount('#app')
