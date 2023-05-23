import getters from '@/stores/bank/getters'
import actions from '@/stores/bank/actions'
import mutations from '@/stores/bank/mutations'
import { InitialState } from '@/stores/bank/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
