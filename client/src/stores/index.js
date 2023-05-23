import Vue from 'vue'
import Vuex from 'vuex'
import mutations from '@/stores/mutations'
import actions from '@/stores/actions'
import getters from '@/stores/getters'
import { initialState } from '@/stores/state'
import accountStore from '@/stores/account'
import notificationStore from '@/stores/notifications'
import submissionsStore from '@/stores/submissions'
import commonStore from '@/stores/common'
import navbarStore from '@/stores/navbar'
import breadcrumbsStore from '@/stores/breadcrumbs'
import featureFlagsStore from '@/stores/feature-flags'

Vue.use(Vuex)

const state = { ...initialState }

export default new Vuex.Store({
  modules: {
    $account: accountStore,
    $notifications: notificationStore,
    $submissions: submissionsStore,
    $common: commonStore,
    $navbar: navbarStore,
    $breadcrumbs: breadcrumbsStore,
    $featureFlags: featureFlagsStore,
  },
  state,
  actions,
  getters,
  mutations,
})
