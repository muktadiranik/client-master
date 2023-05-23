import { getters } from '@/stores/user-profile-transactions/getters'
import { actions } from '@/stores/user-profile-transactions/actions'
import { mutations } from '@/stores/user-profile-transactions/mutations'
import { InitialState } from '@/stores/user-profile-transactions/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
