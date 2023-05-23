import getters from '@/stores/findings/getters'
import actions from '@/stores/findings/actions'
import mutations from '@/stores/findings/mutations'
import { InitialState } from '@/stores/findings/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
