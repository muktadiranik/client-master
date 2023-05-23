import { getters } from '@/stores/integrations-slack/getters'
import { actions } from '@/stores/integrations-slack/actions'
import { mutations } from '@/stores/integrations-slack/mutations'
import { InitialState } from '@/stores/integrations-slack/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
