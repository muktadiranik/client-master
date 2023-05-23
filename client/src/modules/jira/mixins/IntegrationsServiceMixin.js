import {
  STORE_KEY,
  VALIDATE_JIRA_CREDENTIALS,
  AUTHORIZATION_SAVE,
  CREATE_FINDINGS_ISSUES,
  EDIT_JIRA_PROGRAM,
  GET_FIELD_MAPPINGS,
  UPDATE_AUTHORIZATION_FORM,
  RESET_AUTHORIZATION_STATE,
  SAVE_FIELD_MAPPINGS,
  SET_PROGRAM,
  SET_SELECTED_ISSUE_TYPE,
  SET_SELECTED_JIRA_PROJECT,
  LOAD_JIRA_PROGRAM,
  LOAD_PROGRAM_PUBLISHED_FINDINGS,
  SET_ERRORED_FINDINGS,
  CREATE_ISSUE_FAILED,
  RETRY_CREATE_SINGLE_ISSUE,
  TEST_JIRA_CONFIGURATION,
  SAVE_JIRA_CONFIGURATION,
  TOGGLE_JIRA_PROGRAM,
  SELECT_JIRA_PROJECT,
  SELECT_JIRA_ISSUE_TYPE,
  SET_FIELD_MAPPING_OPTION,
  SET_JIRA_LABELS,
  SET_JIRA_EPIC,
} from '@/stores/integrations/types'
import store from '@/stores/integrations'
import { mapActions, mapState, mapGetters } from 'vuex'

export const IntegrationsServiceMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      authorizing: state => state.authorizing,
      authorizationForm: state => state.authorizationForm,
      authorizationLastTestedForm: state => state.authorizationLastTestedForm,
      authorizationSuccessful: state => state.authorizationSuccessful,
      cesppaFields: state => state.cesppaFields,
      jiraFields: state => state.jiraFields,
      jiraProgram: state => state.jiraProgram,
      jiraProjects: state => state.jiraProjects,
      issueTypes: state => state.issueTypes,
      // selectedJiraProject: state => state.selectedJiraProject,
      // selectedIssueType: state => state.selectedIssueType,
      loading: state => state.loading,
      publishedProgramFindings: state => state.programPublishedFindings,
      errorCreatingFindings: state => state.errorCreatingFindings,
      allJiraProjectOptions: state => state.configurationForm.allJiraProjectOptions,
      allJiraIssueTypeOptions: state => state.configurationForm.allJiraIssueTypeOptions,
      allJiraFieldMappingOptions: state => state.configurationForm.allJiraFieldMappingOptions,
      selectedJiraProject: state => state.configurationForm.selectedJiraProject,
      selectedJiraIssueType: state => state.configurationForm.selectedJiraIssueType,
      selectedJiraTitleFieldMapping: state => state.configurationForm.selectedJiraTitleFieldMapping,
      selectedJiraDetailsFieldMapping: state => state.configurationForm.selectedJiraDetailsFieldMapping,
      selectedJiraLabels: state => state.configurationForm.selectedJiraLabels,
      selectedJiraEpic: state => state.configurationForm.selectedJiraEpic,
    }),
    ...mapGetters(STORE_KEY, { createIssueFailed: CREATE_ISSUE_FAILED }),
    authorizationComplete() {
      return this.testedFormIsCurrentForm() && this.authorizationSuccessful
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionValidateJiraCredentials: VALIDATE_JIRA_CREDENTIALS,
      actionAuthorizationSave: AUTHORIZATION_SAVE,
      actionCreateFindingsIssues: CREATE_FINDINGS_ISSUES,
      actionEditJiraProgram: EDIT_JIRA_PROGRAM,
      actionGetFieldMappings: GET_FIELD_MAPPINGS,
      actionLoadJiraProgram: LOAD_JIRA_PROGRAM,
      resetAuthorizationState: RESET_AUTHORIZATION_STATE,
      updateAuthorizationForm: UPDATE_AUTHORIZATION_FORM,
      actionSaveFieldMappings: SAVE_FIELD_MAPPINGS,
      actionSetSelectedJiraProject: SET_SELECTED_JIRA_PROJECT,
      actionSetSelectedIssueType: SET_SELECTED_ISSUE_TYPE,
      actionSetProgram: SET_PROGRAM,
      actionLoadProgramPublishedFindings: LOAD_PROGRAM_PUBLISHED_FINDINGS,
      actionSetErroredFindings: SET_ERRORED_FINDINGS,
      actionSingleRetry: RETRY_CREATE_SINGLE_ISSUE,
      actionTestJiraConfiguration: TEST_JIRA_CONFIGURATION,
      actionSaveJiraConfiguration: SAVE_JIRA_CONFIGURATION,
      actionToggleJiraProgram: TOGGLE_JIRA_PROGRAM,
      actionSelectJiraProject: SELECT_JIRA_PROJECT,
      actionSelectJiraIssueType: SELECT_JIRA_ISSUE_TYPE,
      actionSelectFieldMappingOption: SET_FIELD_MAPPING_OPTION,
      actionHandleLabelChange: SET_JIRA_LABELS,
      actionSelectJiraEpic: SET_JIRA_EPIC,
    }),
    testedFormIsCurrentForm() {
      if (
        Object.values(this.authorizationForm).every(x => !x || x.length === 0) &&
        Object.values(this.authorizationLastTestedForm).every(x => !x || x.length === 0)
      ) {
        return false
      }
      const formStr = JSON.stringify(this.authorizationForm)
      const lastTestedFormStr = JSON.stringify(this.authorizationLastTestedForm)
      return formStr === lastTestedFormStr
    },
  },
  created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
}
