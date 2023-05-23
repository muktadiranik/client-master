import getters from '@/stores/payment-modal/getters'
import actions from '@/stores/payment-modal/actions'
import mutations from '@/stores/payment-modal/mutations'
import { InitialState } from '@/stores/payment-modal/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
