import { actions } from '@/stores/program-pending-transactions/actions'
import { getters } from '@/stores/program-pending-transactions/getters'
import { mutations } from '@/stores/program-pending-transactions/mutations'
import { InitialState } from '@/stores/program-pending-transactions/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
