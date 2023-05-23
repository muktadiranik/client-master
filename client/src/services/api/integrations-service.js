import axios from 'axios'

const IntegrationsService = {
  validateJiraCredentials(email, siteUrl, apiKey) {
    const postData = {
      email: email,
      jira_url: siteUrl,
      api_key: apiKey,
    }
    return axios.post('jira/authorize/', postData)
  },
  authorizationSave(email, siteUrl, apiKey, jiraProgramId, jiraLabels) {
    const postData = {
      email: email,
      jira_url: siteUrl,
      api_key: apiKey,
      program_uuid: jiraProgramId,
      jira_labels: jiraLabels,
    }
    return axios.post('jira/program/create/', postData)
  },
  editJiraProgram(jiraProgramUuid, postData) {
    return axios.patch(`jira/program/${jiraProgramUuid}/`, postData)
  },
  getJiraProgram(programUuid) {
    return axios.get(`jira/program/${programUuid}/`)
  },
  getJiraFieldMappings(programUuid) {
    return axios.get(`jira/program/${programUuid}/field-mappings/`)
  },
  createFindingsIssues(programUuid, findingUuids) {
    return axios.post(`jira/findings/${programUuid}/`, {
      findings: findingUuids,
    })
  },
  saveFieldMappings(jiraProgramUuid, payload) {
    const postData = {
      jira_program_uuid: jiraProgramUuid,
      field_mappings: payload.fieldMappings,
      jira_labels: payload.jiraLabels,
    }
    return axios.post(`jira/program/${jiraProgramUuid}/field-mappings/`, postData)
  },
  getClientIntegrations(integrationUuid) {
    return axios.get(`client-integrations/${integrationUuid}/`)
  },
  getSlackLink(programUuid) {
    return axios.get(`client-integrations/${programUuid}/slack/link/`)
  },
  editClientIntegrations(integrationUuid, data) {
    return axios.patch(`client-integrations/${integrationUuid}/`, data)
  },
  testJiraConfiguration(programUuid, postData) {
    return axios.post(`jira/program/${programUuid}/test-jira-configuration`, postData)
  },
  saveJiraConfiguration(programUuid, configuration, credentials) {
    const postData = { ...configuration, ...credentials, program_uuid: programUuid }
    return axios.post(`jira/program/create/ `, postData)
  },
}

export default IntegrationsService
