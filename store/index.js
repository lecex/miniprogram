import Vue from 'vue'
import Vuex from 'vuex'
import getters from './getters'
import user from './modules/user'

Vue.use(Vuex)

const store = new Vuex.Store({
   state: {
    $u:{},
  },
  mutations : {
    SET_U: (state, u) => {
      state.$u = u
    },
  },
  actions : {
    setU({ commit }, u) {
      commit('SET_U', u)
    }
  },
  modules: {
    user,
  },
  getters
})

export default store
