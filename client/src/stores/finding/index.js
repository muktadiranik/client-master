import getters from '@/stores/finding/getters'
import actions from '@/stores/finding/actions'
import mutations from '@/stores/finding/mutations'
import { InitialState } from '@/stores/finding/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
