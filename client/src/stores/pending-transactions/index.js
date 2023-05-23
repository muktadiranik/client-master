import { actions } from '@/stores/pending-transactions/actions'
import { getters } from '@/stores/pending-transactions/getters'
import { mutations } from '@/stores/pending-transactions/mutations'
import { InitialState } from '@/stores/pending-transactions/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
