import getters from '@/stores/pending-transaction-search/getters'
import actions from '@/stores/pending-transaction-search/actions'
import mutations from '@/stores/pending-transaction-search/mutations'
import { InitialState } from '@/stores/pending-transaction-search/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
