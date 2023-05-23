import {
  CREATE_PROGRAM,
  EDIT_PROGRAM,
  GET_PROGRAM,
  GET_PROGRAM_PUBLIC,
  GET_PROGRAMS,
  INVITE_PROGRAM_OWNER,
  GET_PROGRAMS_SHORT_LIST,
  RESET_STORE,
  TOGGLE_ACTIVE,
  TOGGLE_FOLLOWING,
  TOGGLE_FREEZE,
  TOGGLE_VISIBILITY,
  SEARCH_PROGRAM_OWNERS,
  SEARCH_PROGRAM_MANAGERS,
  SEARCH_RESEARCHERS,
  SET_SHORT_PROGRAMS_LIST,
  TEAM_MEMBER_ACTION,
  CANCEL_INVITATION,
  GET_FEATURED_PROGRAMS,
} from '@/modules/programs/_store/types'
import ProgramService from '@/services/api/program-service'
import AccountService from '@/services/api/account-service'

export default {
  async [CREATE_PROGRAM]({ commit }, payload) {
    return ProgramService.createProgram(payload)
  },
  async [EDIT_PROGRAM]({ commit }, payload) {
    return ProgramService.editProgram(payload.uuid, payload)
  },
  async [GET_PROGRAM]({ commit }, payload) {
    return ProgramService.getProgram(payload)
  },
  async [GET_FEATURED_PROGRAMS]() {
    return ProgramService.getFeaturedPrograms()
  },
  async [GET_PROGRAM_PUBLIC]({ commit }, payload) {
    return ProgramService.getProgramPublic(payload)
  },
  async [GET_PROGRAMS]({ commit }, payload) {
    return ProgramService.getProgramsList(payload)
  },
  async [GET_PROGRAMS_SHORT_LIST]({ commit }, payload) {
    const response = await ProgramService.getShortProgramsList(payload.page, payload.search)
    commit(SET_SHORT_PROGRAMS_LIST, response.data.results)
    return response.data
  },
  async [RESET_STORE]({ commit }) {
    commit(RESET_STORE)
  },
  async [INVITE_PROGRAM_OWNER]({ commit }, payload) {
    return ProgramService.inviteProgramOwner(payload.programUuid, payload.emailAddress, payload.userType)
  },
  async [TEAM_MEMBER_ACTION]({ commit }, payload) {
    return ProgramService.teamMemberAction(payload.programUuid, payload.action, payload.profileUuid, payload.userType)
  },
  async [TOGGLE_ACTIVE]({ commit }, payload) {
    return ProgramService.toggleActive(payload)
  },
  async [TOGGLE_FOLLOWING]({ commit }, payload) {
    return ProgramService.toggleFollowing(payload)
  },
  async [TOGGLE_FREEZE]({ commit }, payload) {
    return ProgramService.toggleFreeze(payload)
  },
  async [TOGGLE_VISIBILITY]({ commit }, payload) {
    return ProgramService.toggleVisibility(payload)
  },
  async [SEARCH_PROGRAM_MANAGERS]({ commit }, payload) {
    return AccountService.userSearch(payload, 'program_manager')
  },
  async [SEARCH_PROGRAM_OWNERS]({ commit }, payload) {
    return AccountService.userSearch(payload, 'application_owner')
  },
  async [SEARCH_RESEARCHERS]({ commit }, payload) {
    return AccountService.userSearch(payload, 'researcher')
  },
  async [CANCEL_INVITATION]({ commit }, payload) {
    return ProgramService.cancelInvitation(payload)
  },
}
