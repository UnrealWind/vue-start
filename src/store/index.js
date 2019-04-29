import Vue from 'vue'
import Vuex from 'vuex'
import {tkParse} from "@moke/vue-tk";
Vue.use(Vuex)
const store = new Vuex.Store({
  state: {
    sessionToken: null,
    user: null,
    cart:{}
  },
  getters: {
    getState:state=>{
      return state
    }
  },
  mutations: {
    setSessionToken (state, sessionToken) {
      state.sessionToken = sessionToken
      tkParse.setSessionToken(sessionToken);
    },
    setUser (state, user) {
      state.user = user
    },
    setCart (state,cart){
      !state.cart[cart.shop.objectId]?state.cart[cart.shop.objectId] = [cart]:(async () =>{
        let has;
        state.cart[cart.shop.objectId].forEach(function(n,i){
          n.objectId == cart.objectId?(n.quantity+=cart.quantity,has = true):'';
        });
        !has?state.cart[cart.shop.objectId].push(cart):'';
      })();
    },
    resetCart(state,cart){
      state.cart =cart;
    },
    initFromStorage (state, opt) {
      for (let i in opt) {
        state[i] = opt[i]
      }
    }
  },
  actions: {}
})
export default store
