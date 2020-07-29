import Login from '../components/Login.vue'
import Home from '../components/Home/Home.vue'


export default [
  {
    path: '/login',
    component: Login
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/',
    redirect: '/login'
  }
]