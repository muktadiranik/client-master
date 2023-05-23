import { actions } from '@/stores/researcher-pending-transactions/actions'
import { getters } from '@/stores/researcher-pending-transactions/getters'
import { mutations } from '@/stores/researcher-pending-transactions/mutations'
import { InitialState } from '@/stores/researcher-pending-transactions/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
