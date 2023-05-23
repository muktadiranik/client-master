import { getters } from '@/stores/user-pending-transactions/getters'
import { actions } from '@/stores/user-pending-transactions/actions'
import { mutations } from '@/stores/user-pending-transactions/mutations'
import { InitialState } from '@/stores/user-pending-transactions/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
