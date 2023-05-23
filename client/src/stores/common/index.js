import getters from '@/stores/common/getters'
import actions from '@/stores/common/actions'
import mutations from '@/stores/common/mutations'
import { InitialState } from '@/stores/common/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
