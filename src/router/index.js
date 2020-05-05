import Vue from 'vue'
import Router from 'vue-router'
import Login from '@/views/Login'
import Home from '@/views/Home'
import Welcome from '@/views/Welcome'
import Users from '@/views/users/Users'
import Perms from '@/views/perm/Perms'
import Roles from '@/views/perm/Roles'
import Reserve from '@/views/meetingroom/Reserve.vue'

Vue.use(Router)

const router = new Router({
  routes: [{
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path: '/home',
      name: "home",
      component: Home,
      redirect: '/welcome',
      children: [{
          path: '/welcome',
          name: 'welcome',
          component: Welcome
        },
        {
          path: '/users',
          name: 'users',
          component: Users
        },
        {
          path: '/perms',
          name: 'perms',
          component: Perms
        },
        {
          path: '/roles',
          name: 'roles',
          component: Roles
        },
        {
          path: '/reservations',
          name: 'reserve',
          component: Reserve
        }
      ]
    }
  ]
})

// 创建导航守卫，判断用户是否登录
router.beforeEach((to, from, next) => {
  if (to.path === '/login') return next()
  const tokenStr = sessionStorage.getItem('token')
  if (!tokenStr) return next('/login')
  next()
})

export default router
