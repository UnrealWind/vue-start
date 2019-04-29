import {tkParse,VueTk} from '@moke/vue-tk'
import router from '../router'
import store from '../store/index';

let routerAuth;
export default routerAuth =  (async() => {
  // TODO: 完成用户自动登录
  return tkParse.get('/users/me')
    .then(function (response) {

      //这里还用了200校验的原因是，不太清楚后台会不会返回 status = '404' 这种状态码和实际场景不符的骚操作，
      response.status == '200'?
        (()=>{
            store.commit('setSessionToken',response.data.sessionToken);
            store.commit('setUser',response.data.username);
            return 'success'
        })():(()=>{
          store.commit('setSessionToken',null);
          return 'error'
        })();
    })
    .catch(function (error) {
      store.commit('setSessionToken',null);
      return 'error'
    })

})();

