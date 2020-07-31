import Login from '../view/Login.vue'
import Home from '../view/Home/Home.vue'
import Welcome from '../view/Welcome/Welcome.vue'
import Users from '../view/Users/Users.vue'
import Rights from '../view/Power/Rights.vue'
import Roles from '../view/Power/Roles.vue'


export default [
  { path: '/login', component: Login },
  {
    path: '/home',
    component: Home,
    redirect: '/welcome',
    children: [
      { path: '/welcome', component: Welcome },
      { path: '/users', component: Users },
      { path: '/rights', component: Rights },
      { path: '/roles', component: Roles },

    ]
  }
]