import {
  GET_CLIENT_INTEGRATIONS,
  GET_SLACK_LINK,
  EDIT_CLIENT_INTEGRATIONS,
  LOAD_PROGRAM,
  SET_PROGRAM,
  RESET_STORE,
  SET_LOADING,
} from '@/stores/integrations-slack/types'
import IntegrationsService from '../../services/api/integrations-service'
import ProgramService from '@/services/api/program-service'

export const actions = {
  async [LOAD_PROGRAM]({ commit, state }, payload) {
    try {
      commit(SET_LOADING, true)
      const response = await ProgramService.getProgram(payload)
      commit(SET_PROGRAM, response.data)
    } catch (e) {
    } finally {
      commit(SET_LOADING, false)
    }
  },
  async [GET_CLIENT_INTEGRATIONS]({ commit, state }, payload) {
    const response = await IntegrationsService.getClientIntegrations(payload.uuid)
    return response.data
  },
  async [GET_SLACK_LINK]({ commit, state }, payload) {
    const response = await IntegrationsService.getSlackLink(payload.uuid)
    return response.data
  },
  async [EDIT_CLIENT_INTEGRATIONS]({ commit, state }, payload) {
    try {
      commit(SET_LOADING, true)
      const response = await IntegrationsService.editClientIntegrations(payload.uuid, payload.data)
      return response.data
    } catch (e) {
    } finally {
      commit(SET_LOADING, false)
    }
  },
  async [RESET_STORE]({ commit, state }, payload) {
    commit(RESET_STORE)
  },
}
