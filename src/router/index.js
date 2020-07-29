import VueRouter from 'vue-router'
import Vue from 'vue'

import routes from './routes.js'

Vue.use(VueRouter)

const router = new VueRouter({
  routes,
})

// 路由守卫
router.beforeEach((to, from, next) => {
  if (to.path === '/login') {
    next()
  } else {
    // 获取token
    const tokenStr = sessionStorage.getItem('token')
    if (!tokenStr) {
      next('/login')
    } else {
      next()
    }
  }
})

export default router
