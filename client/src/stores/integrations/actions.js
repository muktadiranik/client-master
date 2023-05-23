import {
  VALIDATE_JIRA_CREDENTIALS,
  AUTHORIZATION_SAVE,
  CREATE_FINDINGS_ISSUES,
  EDIT_JIRA_PROGRAM,
  GET_FIELD_MAPPINGS,
  LOAD_JIRA_PROGRAM,
  RESET_AUTHORIZATION_STATE,
  SAVE_FIELD_MAPPINGS,
  SET_AUTHORIZING_LOADING,
  SET_AUTHORIZATION_RESULT,
  SET_JIRA_PROGRAM,
  SET_PROGRAM,
  SET_LOADING,
  SET_SELECTED_ISSUE_TYPE,
  SET_SELECTED_JIRA_PROJECT,
  UPDATE_AUTHORIZATION_FORM,
  UPDATE_AUTHORIZATION_LAST_TESTED_FORM,
  LOAD_PROGRAM_PUBLISHED_FINDINGS,
  SET_ERRORED_FINDINGS,
  RETRY_CREATE_SINGLE_ISSUE,
  TEST_JIRA_CONFIGURATION,
  SAVE_JIRA_CONFIGURATION,
  TOGGLE_JIRA_PROGRAM,
  SELECT_JIRA_PROJECT,
  SELECT_JIRA_ISSUE_TYPE,
  SET_FIELD_MAPPING_OPTION,
  SET_JIRA_LABELS,
  SET_JIRA_PROJECT_OPTIONS,
  SET_AUTH_ERROR,
  SET_JIRA_EPIC,
} from '@/stores/integrations/types'
import IntegrationsService from '@/services/api/integrations-service'
import FindingsService from '@/services/api/findings-service'

export default {
  async [AUTHORIZATION_SAVE]({ commit, state }, payload) {
    commit(SET_LOADING, true)
    try {
      const response = await IntegrationsService.authorizationSave(
        state.authorizationForm.email,
        state.authorizationForm.siteUrl,
        state.authorizationForm.apiKey,
        state.program.uuid
      )
      return response.data
    } catch (e) {
      commit(SET_LOADING, false)
      throw e
    } finally {
      commit(SET_LOADING, false)
    }
  },
  async [VALIDATE_JIRA_CREDENTIALS]({ commit, dispatch, state }) {
    commit(SET_AUTHORIZING_LOADING, true)
    commit(SET_LOADING, true)
    let success = false
    try {
      const response = await IntegrationsService.validateJiraCredentials(
        state.authorizationForm.email,
        state.authorizationForm.siteUrl,
        state.authorizationForm.apiKey
      )
      success = response.status === 200
      commit(SET_AUTH_ERROR, false)
      commit(SET_JIRA_PROJECT_OPTIONS, response.data.projects)
    } catch (e) {
      commit(SET_AUTH_ERROR, true)
      success = false
      throw e
    } finally {
      commit(SET_AUTHORIZATION_RESULT, success)
      commit(SET_LOADING, false)
      commit(SET_AUTHORIZING_LOADING, false)
    }
  },
  async [EDIT_JIRA_PROGRAM]({ commit, state }, payload) {
    commit(SET_LOADING, true)
    let success = false
    try {
      const { project, issueType } = payload
      // const project = state.selectedJiraProject
      // const issueType = state.selectedIssueType
      const response = await IntegrationsService.editJiraProgram(state.program.uuid, {
        project_id: project.id,
        project_key: project.key,
        project_name: project.name,
        issue_type: issueType.name,
        issue_type_id: issueType.id,
      })
      success = response.status === 200
    } catch (e) {
      success = false
    } finally {
      commit(SET_LOADING, false)
    }
    return success
  },
  async [GET_FIELD_MAPPINGS]({ commit }, payload) {
    commit(SET_LOADING, true)
    try {
      const response = await IntegrationsService.getJiraFieldMappings(payload.uuid)
      return response
    } catch (e) {
      throw e
    } finally {
      commit(SET_LOADING, false)
    }
  },
  async [LOAD_JIRA_PROGRAM]({ commit, state }) {
    commit(SET_LOADING, true)
    try {
      const { data } = await IntegrationsService.getJiraProgram(state.program.uuid)
      commit(SET_JIRA_PROGRAM, data)
    } catch (e) {
    } finally {
      commit(SET_LOADING, false)
    }
  },
  async [CREATE_FINDINGS_ISSUES]({ commit, state }, payload) {
    commit(SET_LOADING, true)
    try {
      if (payload.length === 0) {
        return
      }
      const response = await IntegrationsService.createFindingsIssues(state.program.uuid, payload)
      commit(SET_ERRORED_FINDINGS, [])
      return response.data
    } catch (e) {
      if (e.data.errored_findings) {
        commit(SET_ERRORED_FINDINGS, e.data.errored_findings)
      }
      throw e
    } finally {
      commit(SET_LOADING, false)
    }
  },
  async [RETRY_CREATE_SINGLE_ISSUE]({ commit, state }, payload) {
    commit(SET_LOADING, true)
    try {
      const response = await IntegrationsService.createFindingsIssues(state.program.uuid, payload)
      commit(
        SET_ERRORED_FINDINGS,
        state.errorCreatingFindings.filter(f => f !== payload[0])
      )
      return response.data
    } catch (e) {
      throw e
    } finally {
      commit(SET_LOADING, false)
    }
  },
  [RESET_AUTHORIZATION_STATE]({ commit }, payload) {
    commit(RESET_AUTHORIZATION_STATE)
  },
  async [SAVE_FIELD_MAPPINGS]({ commit, state }, payload) {
    try {
      commit(SET_LOADING, true)
      const response = await IntegrationsService.saveFieldMappings(state.jiraProgram.uuid, payload)
      commit(SET_JIRA_PROGRAM, response.data)
    } catch (e) {
      throw e
    } finally {
      commit(SET_LOADING, false)
    }
  },
  [SET_SELECTED_ISSUE_TYPE]({ commit }, payload) {
    commit(SET_SELECTED_ISSUE_TYPE, payload)
  },
  [SET_SELECTED_JIRA_PROJECT]({ commit }, payload) {
    commit(SET_SELECTED_JIRA_PROJECT, payload)
  },
  [SET_PROGRAM]({ commit }, payload) {
    commit(SET_PROGRAM, payload)
  },
  [UPDATE_AUTHORIZATION_LAST_TESTED_FORM]({ commit }, payload) {
    commit(UPDATE_AUTHORIZATION_LAST_TESTED_FORM, payload)
  },
  [UPDATE_AUTHORIZATION_FORM]({ commit }, payload) {
    commit(UPDATE_AUTHORIZATION_FORM, payload)
  },
  async [LOAD_PROGRAM_PUBLISHED_FINDINGS]({ commit }, payload) {
    const res = await FindingsService.getAllProgramPublishedFindings(payload)
    commit(LOAD_PROGRAM_PUBLISHED_FINDINGS, res.data)
  },
  async [TEST_JIRA_CONFIGURATION]({ commit }, payload) {
    try {
      // eslint-disable-next-line camelcase
      const { program_uuid, ...configurations } = payload
      await IntegrationsService.testJiraConfiguration(program_uuid, configurations)
    } catch (error) {
      throw error
    }
  },
  async [SAVE_JIRA_CONFIGURATION]({ commit, state }) {
    // jira credentials
    const credentials = {
      email: state.authorizationForm.email,
      jira_url: state.authorizationForm.siteUrl,
      api_key: state.authorizationForm.apiKey,
    }
    // jira configuration
    const configuration = {
      project: state.configurationForm.selectedJiraProject,
      issue_type: state.configurationForm.selectedJiraIssueType,
      field_mappings: [
        {
          cesppa_field: 'title',
          jira_field: state.configurationForm.selectedJiraTitleFieldMapping.name,
          jira_field_id: state.configurationForm.selectedJiraTitleFieldMapping.key,
        },
        {
          cesppa_field: 'details',
          jira_field: state.configurationForm.selectedJiraDetailsFieldMapping.name,
          jira_field_id: state.configurationForm.selectedJiraDetailsFieldMapping.key,
        },
      ],
      jira_labels: state.configurationForm.selectedJiraLabels.map(label => label.text),
      epic: state.configurationForm.selectedJiraEpic,
    }
    try {
      await IntegrationsService.saveJiraConfiguration(state.program.uuid, configuration, credentials)
    } catch (error) {
      throw error
    }
  },
  async [TOGGLE_JIRA_PROGRAM]({ state, dispatch }, jiraIntegrationStatus) {
    try {
      await IntegrationsService.editJiraProgram(state.program.uuid, jiraIntegrationStatus)
    } catch (error) {}
  },

  [SELECT_JIRA_PROJECT]({ commit }, payload) {
    commit(SELECT_JIRA_PROJECT, payload)
  },
  [SELECT_JIRA_ISSUE_TYPE]({ commit }, payload) {
    commit(SELECT_JIRA_ISSUE_TYPE, payload)
  },
  [SET_FIELD_MAPPING_OPTION]({ commit }, payload) {
    commit(SET_FIELD_MAPPING_OPTION, payload)
  },
  [SET_JIRA_LABELS]({ commit }, payload) {
    commit(SET_JIRA_LABELS, payload)
  },
  [SET_JIRA_EPIC]({ commit }, payload) {
    commit(SET_JIRA_EPIC, payload)
  },
}
