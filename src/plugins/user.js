import { tkParse } from '@moke/vue-tk'
import store from '../store/index'

export default async () => {
  // TODO: 完成用户自动登录
  if (!store.state.sessionToken) return;
  VueTk.tkParse.setSessionToken(store.state.sessionToken)

  //这里文档描述的是使用get，但是每次都会报错，应该使用getData
  let res = await VueTk.tkParse.getData('/users/me').catch(e => {
    store.commit('setSessionToken', null)
    VueTk.tkParse.setSessionToken(null)
    throw e
  })
  store.commit('setUser', res)
}
