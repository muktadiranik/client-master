import getters from '@/stores/transaction-modal/getters'
import actions from '@/stores/transaction-modal/actions'
import mutations from '@/stores/transaction-modal/mutations'
import { InitialState } from '@/stores/transaction-modal/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
