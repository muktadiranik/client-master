<template>
  <div class="u-pt-20">
    <div v-if="authorizationForm.error" class="c-alert c-alert--error u-mb-10">
      Your credentials are not valid. Try using other credentials
    </div>
    <form class="c-form">
      <div class="c-form__group u-mb-20">
        <label for="jiraURL" class="c-form__label c-form__label--small">Jira URL</label>
        <div class="c-input-icon u-position-relative l-flex u-ai-center u-width-75">
          <!-- TO DO: check if readonly condition is correct, so the input is not editable once jira is configured  -->
          <input
            :readonly="enabled"
            type="text"
            class="o-input"
            id="jiraURL"
            name="jiraURL"
            placeholder="Enter Jira URL"
            :disabled="saving"
            :value="authorizationForm.siteUrl"
            @input="onAuthorizationFormInput('siteUrl', $event.target.value)"
          />
        </div>
      </div>
      <div class="c-form__group u-mb-20">
        <label for="jiraEmail" class="c-form__label c-form__label--small">Jira Email</label>
        <div class="c-input-icon u-position-relative l-flex u-ai-center u-width-75">
          <input
            :readonly="enabled"
            type="email"
            class="o-input"
            id="jiraEmail"
            name="jiraEmail"
            :disabled="saving"
            placeholder="User@company.com"
            :value="authorizationForm.email"
            @input="onAuthorizationFormInput('email', $event.target.value)"
          />
        </div>
      </div>
      <div class="c-form__group u-mb-20">
        <label for="jiraApiKey" class="c-form__label c-form__label--small">Jira API Key</label>
        <div class="c-input-icon u-position-relative l-flex u-ai-center u-width-75">
          <input
            :readonly="enabled"
            type="password"
            class="o-input"
            id="jiraApiKey"
            name="jiraApiKey"
            placeholder="Jira API Key"
            :value="authorizationForm.apiKey"
            :disabled="saving"
            @input="onAuthorizationFormInput('apiKey', $event.target.value)"
          />
        </div>
      </div>
    </form>

    <div class="u-flex-buttons u-jc-sb">
      <button
        type="button"
        class="o-btn o-btn--primary o-btn--rounded-sm o-btn--sm"
        @click="validateJiraCredentials"
        :disabled="validateCredentialsDisabled"
      >
        <span>Next</span>
      </button>
    </div>
  </div>
</template>

<script>
import { IntegrationsServiceMixin } from '@/modules/jira/mixins/IntegrationsServiceMixin'

export default {
  name: 'JiraAuthenticationForm',
  mixins: [IntegrationsServiceMixin],
  props: {
    enabled: {
      type: Boolean,
      required: true,
      default: () => false,
    },
  },
  data() {
    return {
      saving: false,
      expanded: false,
      jiraProgramEnabled: false,
    }
  },
  computed: {
    validateCredentialsDisabled() {
      return this.authorizing || (this.authorizationSuccessful && this.testedFormIsCurrentForm())
    },
    saveAuthorizationDisabled() {
      return this.saving || this.authorizing || !this.authorizationSuccessful || !this.testedFormIsCurrentForm()
    },
    showAuthorizationErrorIndicator() {
      return this.testedFormIsCurrentForm() && !this.authorizationSuccessful
    },
    showAuthorizationSuccessIndicator() {
      return this.testedFormIsCurrentForm() && this.authorizationSuccessful
    },
  },
  methods: {
    async onAuthorizationFormInput(field, value) {
      await this.updateAuthorizationForm({ field, value })
    },
    async validateJiraCredentials() {
      this.$emit('on-validate-credentials')
    },
    async saveAuthorization() {
      this.$solar.show()
      this.saving = true
      try {
        await this.actionAuthorizationSave()
        await this.actionLoadJiraProgram()
        this.$caAlert.success('Authorization settings saved.')
      } catch (e) {
        this.$caAlert.error('Failed to save authorization settings.')
      } finally {
        this.saving = false
        this.$solar.hide()
      }
    },
  },
}
</script>
