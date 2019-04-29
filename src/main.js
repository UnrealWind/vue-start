import 'babel-polyfill'
import Vue from 'vue'
import router from './router'
import VueTk from '@moke/vue-tk'
import App from './App.vue'
import config from './config'
import './assets/scss/main.scss'
import store from '../src/store/index'

Vue.config.productionTip = false

let plusReady = new Promise((resolve) => {
  if (!VueTk.tkUa.isPlus) resolve()
  if (window.plus) resolve()
  document.addEventListener('plusready', resolve, false)
})

async function init () {
  for (let pluginName of config.plugins) {
    let plugin = require('./plugins/' + pluginName)
    if (plugin && plugin.default && typeof plugin.default === 'function') {
      await plugin.default()
    }
  }
  await plusReady
  new Vue({
    router,
    store,
    render: h => h(App)
  }).$mount('#app')
}
init()
