import { actions } from '@/stores/program-transactions/actions'
import { getters } from '@/stores/program-transactions/getters'
import { mutations } from '@/stores/program-transactions/mutations'
import { InitialState } from '@/stores/program-transactions/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
