import getters from './getters'
import actions from './actions'
import mutations from './mutations'
import { InitialState } from './state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
