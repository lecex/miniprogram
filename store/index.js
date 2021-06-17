import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'
import data from './modules/data'
import wxfaceapp from './modules/wxfaceapp'

Vue.use(Vuex)

const store = new Vuex.Store({
   state: {
    $u:{},
    onReachBottom:false,
  },
  mutations : {
    SET_U: (state, u) => {
      state.$u = u
    },
    ON_REACH_BOTTOM: (state, ) => {
      state.onReachBottom = !state.onReachBottom
    },
  },
  actions : {
    setU({ commit }, u) {
      commit('SET_U', u)
    },
    onReachBottom({ commit }) {
      commit('ON_REACH_BOTTOM')
    },
  },
  modules: {
    user,
    data,
    wxfaceapp,
  },
  getters
})

export default store
