import getters from '@/stores/green-room/getters'
import actions from '@/stores/green-room/actions'
import mutations from '@/stores/green-room/mutations'
import { InitialState } from '@/stores/green-room/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
