import router from '../router'
import VueTk from '@moke/vue-tk'
import store from '../store/index';
import routerAuth from './user.js';


const auth = [{
  match: '*',
  // match: '',
  except: '/login',
  handler: function(route, next) { // 路由鉴权方法
      // 判断路由是否有权访问
      if (store.state.sessionToken) {
        next(true) // 可以访问
        /* } else if () {
           next(false) // 禁止访问*/
      }else {
        next('/login') // 跳转到该地址
      }

  },
  fallbackUrl: '' // 禁止访问的跳转地址，优先级低于handler中返回的地址
}]

routerAuth.then(function(res){
  /*fydebug 这个用过之后 flash就炸了
  VueTk.history.init(router,{
    transitionMode:"always"
  });*/
  res == 'success'?(VueTk.tkRouterAuth.init(auth, router),VueTk.history.replace('/')):(VueTk.tkRouterAuth.init(auth, router),VueTk.history.replace('/login'))
})


