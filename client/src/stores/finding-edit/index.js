import getters from '@/stores/finding-edit/getters'
import actions from '@/stores/finding-edit/actions'
import mutations from '@/stores/finding-edit/mutations'
import { InitialState } from '@/stores/finding-edit/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
