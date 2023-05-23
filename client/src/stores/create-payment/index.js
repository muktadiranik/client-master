import getters from '@/stores/create-payment/getters'
import actions from '@/stores/create-payment/actions'
import mutations from '@/stores/create-payment/mutations'
import { InitialState } from '@/stores/create-payment/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
