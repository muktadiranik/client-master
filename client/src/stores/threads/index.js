import getters from '@/stores/threads/getters'
import actions from '@/stores/threads/actions'
import mutations from '@/stores/threads/mutations'
import { InitialState } from '@/stores/threads/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
