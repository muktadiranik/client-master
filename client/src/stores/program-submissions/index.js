import getters from '@/stores/program-submissions/getters'
import actions from '@/stores/program-submissions/actions'
import mutations from '@/stores/program-submissions/mutations'
import { InitialState } from '@/stores/program-submissions/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
