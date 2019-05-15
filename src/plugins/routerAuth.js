import router from '../router'
import VueTk from '@moke/vue-tk'
import store from '../store/index'
import routerAuth from './user.js'

const auth = [{
  match: '*',
  except: [
    '/login',
    '/user',
    '/cart',
    '/'
  ],
  handler: function (route, next) { // 路由鉴权方法
    // 判断路由是否有权访问
    if (store.state.user && store.state.sessionToken) {
      store.state.user.role !== 'buyer' && route.path == '/' ? next('/merchant/bikeList') : next(true)
    } else {
      next('/login') // 跳转到该地址
    }
  },
  fallbackUrl: '' // 禁止访问的跳转地址，优先级低于handler中返回的地址
}]

VueTk.tkRouterAuth.init(auth, router)
