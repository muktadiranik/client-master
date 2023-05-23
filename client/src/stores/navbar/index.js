import { getters } from '@/stores/navbar/getters'
import { actions } from '@/stores/navbar/actions'
import { mutations } from '@/stores/navbar/mutations'
import { InitialState } from '@/stores/navbar/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
