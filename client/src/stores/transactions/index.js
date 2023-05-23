import getters from '@/stores/transactions/getters'
import actions from '@/stores/transactions/actions'
import mutations from '@/stores/transactions/mutations'
import { InitialState } from '@/stores/transactions/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
