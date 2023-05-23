<template>
  <div>
    <div class="c-box u-p-0 u-mt-20" v-if="jiraProgram && jiraProgram.id">
      <div class="c-box__header">
        <h6 class="o-h6">Jira Settings</h6>
      </div>
      <!-- /.c-box__header -->
      <div class="c-box__body">
        <form class="c-form l-grid l-grid--row-gap-30">
          <div class="c-form__group">
            <label class="c-form__label c-form__label--small" for="project">Project</label>
            <div class="c-select-container">
              <select
                class="o-input o-input--select"
                id="project"
                :disabled="saving"
                name="project"
                @change="onProjectSelected($event.target.value)"
              >
                <option value="0">Select a project...</option>
                <option
                  v-for="(project, index) in jiraProjects"
                  :key="`project-${index}`"
                  :value="JSON.stringify(project)"
                  :selected="selectedJiraProject.id === project.id"
                  >{{ project.name }}</option
                >
              </select>
            </div>
          </div>
          <div class="c-form__group">
            <label class="c-form__label c-form__label--small" for="issue-type">Issue Type</label>
            <div class="c-select-container">
              <select
                class="o-input o-input--select"
                id="issue-type"
                :disabled="saving"
                name="issue-type"
                @change="onIssueTypeSelected($event.target.value)"
              >
                <option value="">Select an issue type...</option>
                <option
                  v-for="(issueType, index) in issueTypes"
                  :key="`issueType-${index}`"
                  :value="JSON.stringify(issueType)"
                  :selected="selectedIssueType.name === issueType.name"
                  >{{ issueType.name }}</option
                >
              </select>
            </div>
          </div>
        </form>
      </div>
      <!-- /.c-box__body -->
      <div class="c-box__footer">
        <div class="u-d-f u-jc-fe">
          <button class="o-btn o-btn--primary o-btn--rounded-sm o-btn--sm" @click="saveJiraSettings" :disabled="saving">
            Save
          </button>
        </div>
      </div>
      <!-- /.c-box__footer -->
    </div>
    <!-- /.c-box -->
  </div>
</template>

<script>
import { IntegrationsServiceMixin } from '@/modules/jira/mixins/IntegrationsServiceMixin'

export default {
  name: 'JiraSettingsForm',
  mixins: [IntegrationsServiceMixin],
  data() {
    return {
      form: {
        program: '',
      },
      saving: false,
    }
  },
  methods: {
    onIssueTypeSelected(issueTypeStr) {
      this.actionSetSelectedIssueType(JSON.parse(issueTypeStr))
    },
    onProjectSelected(programStr) {
      this.actionSetSelectedJiraProject(JSON.parse(programStr))
    },
    async saveJiraSettings() {
      this.$solar.show()
      try {
        this.saving = true
        await this.actionEditJiraProgram()
        await this.actionLoadJiraProgram()
        this.$caAlert.success('Settings saved.')
      } catch (e) {
        this.$caAlert.error('Failed to save changes to integrations settings.')
      } finally {
        this.$solar.hide()
        this.saving = false
      }
    },
  },
}
</script>
