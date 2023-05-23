<template>
  <div>
    <div class="c-box">
      <div class="c-box__header">
        <div class="c-box__header__text">Jira</div>
      </div>
      <!-- /.c-box__header -->
      <div class="c-box__body u-p-15">
        <div class="u-space-between u-ai-center u-pb-5">
          <div class="l-flex u-ai-center">
            <div class="c-badge--integration" :class="enabled ? 'c-badge--integration--enabled' : ''">
              <img :src="enabled ? '/static/images/icons/jira.svg' : '/static/images/icons/jira-gray.svg'" alt="jira icon" />
              <span class="u-ml-10">Jira is {{ enabled ? '' : 'not' }} configured</span>
            </div>
            <i
              v-if="enabled"
              @click.prevent="deleteJiraProgram"
              class="fal fa-trash-alt u-ml-15 u-cursor-pointer u-fs-18 o-text--gray"
            ></i>
          </div>
          <div class="l-flex u-ai-center">
            <span class="u-fs-11 u-mr-15">{{ enabled ? 'Enabled' : 'Disabled' }}</span>
            <label class="c-switch c-switch--sm" for="jira-enabled-toggle">
              <input
                type="checkbox"
                id="jira-enabled-toggle"
                name="jira-enabled-toggle"
                :checked="enabled"
                ref="jiraEnabledCheckbox"
                :value="jiraProgramEnabled"
                @click.prevent="toggleJiraProgramEnabled"
              />
              <span class="c-switch__slider"></span>
            </label>
          </div>
        </div>
        <!-- TAB NAVIGATION -->
        <nav class="c-tab-nav c-tab-nav--jira">
          <ul class="c-tab-nav__list">
            <li @click="currentTab = 'credentials'" :class="{ 'is-active': currentTab === 'credentials' }">
              <span>1. Credentials</span>
            </li>
            <li
              @click="authorizationSuccessful || enabled ? (currentTab = 'configuration') : null"
              :class="{ 'is-active': currentTab === 'configuration', 'is-disabled': !authorizationSuccessful }"
            >
              <span>2. Configuration</span>
            </li>
            <li
              @click="authorizationSuccessful || enabled ? (currentTab = 'create-issues') : null"
              :class="{ 'is-active': currentTab === 'create-issues', 'is-disabled': !authorizationSuccessful }"
            >
              <span>3. Create Issues</span>
            </li>
          </ul>
        </nav>
        <div v-show="this.enableError" class="c-alert c-alert--error u-mt-20 u-ml-15 u-mr-15">
          Please validate Jira credentials and complete integration before enabling
        </div>
        <JiraAuthenticate
          v-show="currentTab === 'credentials'"
          :enabled="enabled"
          @on-delete="toggleJiraProgramEnabled"
          :authorizationSuccessful="authorizationSuccessful"
          @on-validate-credentials="validateCredentials"
        />
        <JiraConfiguration v-show="currentTab === 'configuration'" @on-next="onNext" />
        <JiraCreateIssuesForm v-show="currentTab === 'create-issues'" @on-cancel="onCancel" />
      </div>
    </div>
  </div>
  <!-- /.c-box -->
</template>

<script>
import { IntegrationsServiceMixin } from '@/modules/jira/mixins/IntegrationsServiceMixin'
import JiraConfiguration from '@/modules/jira/components/JiraConfiguration'
import JiraAuthenticate from '@/modules/jira/components/JiraAuthenticate'
import JiraCreateIssuesForm from './JiraCreateIssuesForm.vue'

export default {
  components: {
    JiraConfiguration,
    JiraAuthenticate,
    JiraCreateIssuesForm,
  },
  name: 'JiraAuthenticationForm',
  mixins: [IntegrationsServiceMixin],
  data() {
    return {
      saving: false,
      expanded: false,
      jiraProgramEnabled: false,
      jiraIntegrationSetupOptions: [],
      currentTab: 'credentials',
      enableError: false,
    }
  },
  computed: {
    cardClass() {
      return this.expanded ? '' : 'is-collapsed'
    },
    enabled() {
      return this.jiraProgram && this.jiraProgram.enabled
    },
  },
  methods: {
    async toggleJiraProgramEnabled() {
      if (!this.enabled) {
        this.enableError = true
        setTimeout(() => {
          this.enableError = false
        }, 4000)
        return
      }
      try {
        this.saving = true
        await this.actionToggleJiraProgram({
          enabled: !this.jiraProgram.enabled,
        })
        await this.actionLoadJiraProgram()
      } catch (e) {
      } finally {
        this.currentTab = 'credentials'
      }
    },
    async validateCredentials() {
      try {
        await this.actionValidateJiraCredentials()
        this.currentTab = 'configuration'
      } catch (error) {
      } finally {
      }
    },
    async deleteJiraProgram() {
      try {
        await this.actionToggleJiraProgram({
          deleted: true,
          enabled: false,
        })
        await this.actionLoadJiraProgram()
        this.resetAuthorizationState()
      } catch (error) {}
    },
    onNext() {
      this.currentTab = 'create-issues'
    },
    async onCancel() {
      this.currentTab = 'credentials'
      await this.resetAuthorizationState()
    },
  },
  watch: {
    jiraProgram(newVal, oldVal) {
      const enabled = newVal && newVal.enabled && newVal.enabled === true
      this.jiraProgramEnabled = enabled
      this.$refs.jiraEnabledCheckbox.checked = this.jiraProgramEnabled
    },
  },
}
</script>
