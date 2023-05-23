import getters from '@/stores/integrations/getters'
import actions from '@/stores/integrations/actions'
import mutations from '@/stores/integrations/mutations'
import { InitialState } from '@/stores/integrations/state'
import Vue from 'vue'

export default {
  namespaced: true,
  state: Vue.util.extend({}, InitialState),
  actions,
  mutations,
  getters,
}
