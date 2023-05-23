import { getters } from '@/stores/user-transactions/getters'
import { actions } from '@/stores/user-transactions/actions'
import { mutations } from '@/stores/user-transactions/mutations'
import { InitialState } from '@/stores/user-transactions/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
