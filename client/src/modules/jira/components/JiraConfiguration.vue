<template>
  <div class="u-pt-20">
    <!-- Select project -->
    <div class="c-form__group u-mb-20 u-width-75">
      <JiraProjectDropdown
        :projects="allJiraProjectOptions"
        :selectedProject="selectedJiraProject"
        @on-project-selected="onProjectSelected"
      />
    </div>

    <!-- Select Issue Type -->
    <div class="c-form__group u-mb-20 u-width-75">
      <JiraIssueTypeDropdown
        :issueTypes="allJiraIssueTypeOptions"
        :selectedIssue="selectedJiraIssueType"
        @on-issue-type-selected="onIssueTypeSelected"
      />
    </div>
    <!-- Select title field mapping-->
    <div class="c-form__group u-mb-20 u-width-75">
      <JiraTitleFieldMappingDropdown
        :fieldMappingOptions="allJiraFieldMappingOptions"
        :selectedTitleFieldMappingOption="selectedJiraTitleFieldMapping"
        @on-field-mapping-selection="onFieldMappingSelection"
      />
    </div>
    <!-- Select details field mapping -->
    <div class="c-form__group u-mb-15 u-width-75">
      <JiraDetailsFieldMappingDropdown
        :fieldMappingOptions="allJiraFieldMappingOptions"
        :selectedDetailsFieldMappingOption="selectedJiraDetailsFieldMapping"
        @on-field-mapping-selection="onFieldMappingSelection"
      />
    </div>
    <!-- Select Epic if selected project contains Epics -->
    <div class="c-form__group u-mb-20 u-width-75" v-if="epicJiraOption">
      <JiraProjectEpicDropdown
        :selectedProjectEpics="selectedJiraProject.epics || []"
        :selectedEpic="selectedJiraEpic"
        @on-epic-selected="onEpicSelected"
      />
    </div>
    <div class="c-form__group u-mb-15 u-width-75">
      <label for="jiraLabels" class="c-form__label c-form__label--small">Jira Labels</label>
      <div>
        <vue-tags-input
          v-model="jiraLabelInput"
          :tags="selectedJiraLabels"
          :add-on-key="[13, 32]"
          @tags-changed="handleLabelChange"
          placeholder="Add labels..."
        />
      </div>
    </div>
    <div>
      <!-- <button class="o-btn o-btn--outline-primary o-btn--rounded-sm o-btn--sm u-mr-2">Cancel</button> -->
      <button
        class="o-btn o-btn--primary o-btn--rounded-sm o-btn--sm"
        :disabled="!formComplete"
        @click="$emit('on-next')"
      >
        Next
      </button>
    </div>
  </div>
</template>

<script>
import { IntegrationsServiceMixin } from '@/modules/jira/mixins/IntegrationsServiceMixin'
import VueTagsInput from '@johmun/vue-tags-input'
import JiraProjectDropdown from './JiraProjectDropdown.vue'
import JiraIssueTypeDropdown from './JiraIssueTypeDropdown.vue'
import JiraTitleFieldMappingDropdown from './JiraTitleFieldMappingDropdown.vue'
import JiraDetailsFieldMappingDropdown from './JiraDetailsFieldMappingDropdown.vue'
import JiraProjectEpicDropdown from './JiraProjectEpicDropdown.vue'
import { FeatureFlagsMixin } from '@/mixins/feature-flags'

export default {
  name: 'JiraConfiguration',
  mixins: [IntegrationsServiceMixin, FeatureFlagsMixin],
  components: {
    VueTagsInput,
    JiraProjectDropdown,
    JiraIssueTypeDropdown,
    JiraTitleFieldMappingDropdown,
    JiraDetailsFieldMappingDropdown,
    JiraProjectEpicDropdown,
  },
  data() {
    return {
      isSaving: false,
      saving: false,
      readyToSave: false,
      successfulTest: false,
      jiraLabelInput: '',
    }
  },
  props: {},
  computed: {
    validated: function() {
      if (this.project && this.issueType && this.mapDetails && this.mapTitle) {
        return true
      }
      return false
    },

    formComplete: function() {
      return (
        this.selectedJiraDetailsFieldMapping.name &&
        this.selectedJiraTitleFieldMapping.name &&
        this.selectedJiraIssueType.name &&
        this.selectedJiraProject.name
      )
    },
  },

  methods: {
    onProjectSelected(project) {
      const { issue_types: issueTypes, ...selectedProject } = project
      this.actionSelectJiraProject({ selectedProject, issueTypes })
    },
    onIssueTypeSelected(issueType) {
      const { fields: fieldMappingOptions, ...selectedIssueType } = issueType
      this.actionSelectJiraIssueType({ selectedIssueType, fieldMappingOptions })
    },
    onFieldMappingSelection(payload) {
      this.actionSelectFieldMappingOption(payload)
    },
    onDetailFieldMapping(fieldMapping) {
      this.selectedFieldMapping.details = fieldMapping
    },
    onEpicSelected(epic) {
      this.actionSelectJiraEpic(epic)
    },
    async saveConfiguration() {
      try {
        this.isSaving = true
        const { selectedProject, selectedIssueType, selectedFieldMapping } = this
        const configuration = {
          project: selectedProject,
          issue_type: selectedIssueType,
          field_mappings: [
            {
              cesppa_field: 'title',
              jira_field: selectedFieldMapping.title.name,
              jira_field_id: selectedFieldMapping.title.key,
            },
            {
              cesppa_field: 'details',
              jira_field: selectedFieldMapping.details.name,
              jira_field_id: selectedFieldMapping.details.key,
            },
          ],
          jira_labels: this.jiraLabels.map(label => label.text),
        }
        await this.actionSaveJiraConfiguration(configuration)
      } catch (error) {
      } finally {
        this.isSaving = false
        this.actionLoadJiraProgram()
      }
    },
    handleLabelChange(label) {
      this.actionHandleLabelChange(label)
    },
  },
}
</script>
