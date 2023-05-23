import getters from '@/stores/submissions/getters'
import actions from '@/stores/submissions/actions'
import mutations from '@/stores/submissions/mutations'
import { InitialState } from '@/stores/submissions/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
