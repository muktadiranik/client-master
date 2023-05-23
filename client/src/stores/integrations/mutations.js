import {
  RESET_AUTHORIZATION_STATE,
  RESET_STORE,
  SET_AUTHORIZATION_RESULT,
  SET_JIRA_PROGRAM,
  SET_PROGRAM,
  SET_SELECTED_ISSUE_TYPE,
  SET_SELECTED_JIRA_PROJECT,
  UPDATE_AUTHORIZATION_FORM,
  UPDATE_AUTHORIZATION_LAST_TESTED_FORM,
  SET_AUTHORIZING_LOADING,
  SET_LOADING,
  LOAD_PROGRAM_PUBLISHED_FINDINGS,
  SET_ERRORED_FINDINGS,
  SELECT_JIRA_PROJECT,
  SELECT_JIRA_ISSUE_TYPE,
  SET_FIELD_MAPPING_OPTION,
  SET_JIRA_LABELS,
  SET_JIRA_PROJECT_OPTIONS,
  SET_AUTH_ERROR,
  SET_JIRA_EPIC,
} from '@/stores/integrations/types'

import { InitialState } from './state'

export default {
  [UPDATE_AUTHORIZATION_LAST_TESTED_FORM]: (state, payload) => {
    state.authorizationLastTestedForm = {
      apiKey: payload.apiKey,
      email: payload.email,
      siteUrl: payload.siteUrl,
    }
  },
  [UPDATE_AUTHORIZATION_FORM]: (state, payload) => {
    state.authorizationForm[payload.field] = payload.value
  },
  [RESET_AUTHORIZATION_STATE]: state => {
    state.authorizing = false
    state.authorizationSuccessful = false
    state.authorizationForm = {
      apiKey: '',
      email: '',
      siteUrl: '',
      error: false,
    }
    state.authorizationLastTestedForm = {
      apiKey: '',
      email: '',
      siteUrl: '',
    }

    state.configurationForm = {
      allJiraProjectOptions: [],
      allJiraIssueTypeOptions: [],
      allJiraFieldMappingOptions: [],
      selectedJiraProject: {},
      selectedJiraIssueType: {},
      selectedJiraTitleFieldMapping: {},
      selectedJiraDetailsFieldMapping: {},
      selectedJiraLabels: [],
      selectedJiraEpic: {},
    }
  },
  [RESET_STORE]: state => {
    Object.assign(state, InitialState)
  },
  [SET_AUTHORIZING_LOADING]: (state, payload) => {
    state.authorizing = payload
  },
  [SET_AUTHORIZATION_RESULT]: (state, payload) => {
    state.authorizationSuccessful = payload
  },
  [SET_LOADING]: (state, payload) => {
    state.loading = payload
  },
  [SET_JIRA_PROGRAM]: (state, payload) => {
    state.jiraProjects = payload.projects
    state.jiraProgram = payload.data
    state.issueTypes = payload.issue_types
    state.cesppaFields = payload.cesppa_fields
    state.jiraFields = payload.jira_fields

    if (state.jiraProgram) {
      // set all options associated with api key
      state.configurationForm.allJiraProjectOptions = payload.data.details.projects
      // set selected project
      const selectedProject = {
        name: payload.data.project_name,
        id: payload.data.project_id,
        key: payload.data.project_key,
      }
      state.configurationForm.selectedJiraProject = selectedProject
      // set selected issue type
      const selectedIssueType = {
        id: payload.data.issue_type_id,
        name: payload.data.issue_type,
      }
      state.configurationForm.selectedJiraIssueType = selectedIssueType

      // set selected epic
      const selectedEpic = {
        id: payload.data.epic_id,
        name: payload.data.epic_name
      }
      state.configurationForm.selectedJiraEpic = selectedEpic

      for (let fieldMapping of payload.data.mapped_fields) {
        if (fieldMapping.cesppa_field === 'title') {
          state.configurationForm.selectedJiraTitleFieldMapping = {
            name: fieldMapping.jira_field,
            key: fieldMapping.jira_field_id,
          }
        } else if (fieldMapping.cesppa_field === 'details') {
          state.configurationForm.selectedJiraDetailsFieldMapping = {
            name: fieldMapping.jira_field,
            key: fieldMapping.jira_field_id,
          }
        }
      }

      const formattedJiraLabels = []
      for (let label of payload.data.jira_labels) {
        formattedJiraLabels.push({ text: label })
      }
      state.configurationForm.selectedJiraLabels = formattedJiraLabels

      const authForm = {
        apiKey: state.jiraProgram.api_key,
        email: state.jiraProgram.email,
        siteUrl: state.jiraProgram.jira_url,
      }
      Object.assign(state.authorizationForm, authForm)
      Object.assign(state.authorizationLastTestedForm, authForm)

      if (state.jiraProjects) {
        const project = state.jiraProjects.find(x => x.id === state.jiraProgram.project_id)
        state.selectedJiraProject = project || {}
      }

      if (state.issueTypes) {
        const issueType = state.issueTypes.find(x => x.name === state.jiraProgram.issue_type)
        state.selectedIssueType = issueType || {}
      }

      state.authorizationSuccessful = true
    }
  },
  [SET_PROGRAM]: (state, payload) => {
    state.program = payload
  },
  [SET_SELECTED_JIRA_PROJECT]: (state, payload) => {
    state.selectedJiraProject = payload
  },
  [SET_SELECTED_ISSUE_TYPE]: (state, payload) => {
    state.selectedIssueType = payload
  },
  [LOAD_PROGRAM_PUBLISHED_FINDINGS]: (state, payload) => {
    state.programPublishedFindings = payload
  },
  [SET_ERRORED_FINDINGS]: (state, payload) => {
    state.errorCreatingFindings = payload
  },
  [SELECT_JIRA_PROJECT]: (state, payload) => {
    const { selectedProject, issueTypes } = payload
    state.configurationForm.selectedJiraProject = selectedProject
    state.configurationForm.allJiraIssueTypeOptions = issueTypes.filter(issue => {
      // remove Epic and sub task as issue type options
      if (issue.name === 'Epic' || issue.name === 'Sub-task') {
        return false
      }
      return true
    })
    state.configurationForm.allJiraFieldMappingOptions = []
    state.configurationForm.selectedJiraIssueType = {}
    state.configurationForm.selectedJiraTitleFieldMapping = {}
    state.configurationForm.selectedJiraDetailsFieldMapping = {}
    state.configurationForm.selectedJiraLabels = []
    state.configurationForm.selectedJiraEpic = {}
  },
  [SELECT_JIRA_ISSUE_TYPE]: (state, payload) => {
    const { selectedIssueType, fieldMappingOptions } = payload
    state.configurationForm.selectedJiraIssueType = selectedIssueType
    state.configurationForm.allJiraFieldMappingOptions = fieldMappingOptions
  },
  [SET_FIELD_MAPPING_OPTION]: (state, payload) => {
    const { type, fieldMapping } = payload
    if (type === 'title') {
      state.configurationForm.selectedJiraTitleFieldMapping = fieldMapping
    } else if (type === 'details') {
      state.configurationForm.selectedJiraDetailsFieldMapping = fieldMapping
    }
  },
  [SET_JIRA_LABELS]: (state, payload) => {
    state.configurationForm.selectedJiraLabels = payload
  },
  [SET_JIRA_PROJECT_OPTIONS]: (state, payload) => {
    state.configurationForm.allJiraProjectOptions = payload
  },
  [SET_AUTH_ERROR]: (state, payload) => {
    state.authorizationForm.error = payload
  },
  [SET_JIRA_EPIC]: (state, payload) => {
    state.configurationForm.selectedJiraEpic = payload
  },
}
