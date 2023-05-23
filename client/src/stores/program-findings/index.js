import getters from '@/stores/program-findings/getters'
import actions from '@/stores/program-findings/actions'
import mutations from '@/stores/program-findings/mutations'
import { InitialState } from '@/stores/program-findings/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
