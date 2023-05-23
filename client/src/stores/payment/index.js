import getters from '@/stores/payment/getters'
import actions from '@/stores/payment/actions'
import mutations from '@/stores/payment/mutations'
import { InitialState } from '@/stores/payment/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
