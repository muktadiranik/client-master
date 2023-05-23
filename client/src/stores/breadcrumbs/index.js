import { getters } from '@/stores/breadcrumbs/getters'
import { actions } from '@/stores/breadcrumbs/actions'
import { mutations } from '@/stores/breadcrumbs/mutations'
import { InitialState } from '@/stores/breadcrumbs/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
