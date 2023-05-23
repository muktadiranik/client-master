import {
  STORE_KEY,
  GET_ASSIGNED_PROGRAMS,
  GET_USER,
  GET_PROFILE,
  LOAD_DASHBOARD,
  LOAD_PROFILE,
  SYNTHETIC_LOGIN,
  GET_ENTRY_REDIRECT,
  SET_ENTRY_REDIRECT,
  DELETE_USER,
  LOGOUT,
} from '@/stores/account/types'
import store from '@/stores'
import { mapGetters, mapActions } from 'vuex'

export const AccountMixin = {
  computed: {
    ...mapGetters(STORE_KEY, {
      profile: GET_PROFILE,
      assignedPrograms: GET_ASSIGNED_PROGRAMS,
      getEntryRedirect: GET_ENTRY_REDIRECT,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadProfile: LOAD_PROFILE,
      actionLoadDashboard: LOAD_DASHBOARD,
      actionSyntheticLogin: SYNTHETIC_LOGIN,
      actionSetEntryRedirect: SET_ENTRY_REDIRECT,
      actionDeleteUser: DELETE_USER,
      actionLogOut: LOGOUT,
    }),
    getProfile() {
      const profile = store.getters[`${STORE_KEY}/${GET_PROFILE}`]
      if (!profile || !profile.uuid) {
        store.dispatch(LOAD_PROFILE)
        return null
      }

      return profile
    },
    userIsActive() {
      const user = store.getters[`${STORE_KEY}/${GET_USER}`]
      return (user && user.active) || false
    },
    userIsAuthenticated() {
      const user = store.getters[`${STORE_KEY}/${GET_USER}`]
      return (user && user.token) || false
    },
    getUserType() {
      return store.getters[`${STORE_KEY}/${GET_USER}`].user_type
    },
    getUserTypeClass() {
      const userType = this.getUserType().toLowerCase()
      switch (userType) {
        case 'researcher':
          return 'researcher'
        case 'program_manager':
          return 'programManager'
        case 'application_owner':
          return 'appOwner'
        default:
          return ''
      }
    },
    userIsAppOwner() {
      return this.getUserType() === 'application_owner'
    },
    userIsBanker() {
      return this.getUserType() === 'banker'
    },
    userIsProgramManager() {
      return this.getUserType() === 'program_manager'
    },
    userIsResearcher() {
      return this.getUserType() === 'researcher'
    },
    isAssignedToProgram(programUuid) {
      const profile = this.getProfile()
      if (!profile || !profile.assigned_programs) {
        return false
      }
      return profile.assigned_programs.includes(programUuid)
    },
  },
}
