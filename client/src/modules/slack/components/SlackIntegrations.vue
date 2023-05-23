<template>
  <div class="c-box">
    <div class="c-box__header c-box__header--no-border-bottom">
      <div class="c-box__header__text">Slack</div>
    </div>
    <!-- /.c-box__header -->
    <div class="c-box__body c-box__body--border-top u-p-15">
      <div class="u-space-between u-ai-center u-mb-20">
        <div class="l-flex u-ai-center">
          <div class="c-badge--integration" :class="enabled ? 'c-badge--integration--enabled' : ''">
            <img :src="enabled ? '/static/images/icons/slack.svg' : '/static/images/icons/slack-gray.svg'" alt="slack icon" />
            <span class="u-ml-10">Slack is {{ enabled ? '' : 'not' }} configured</span>
          </div>
          <i v-if="enabled" @click.prevent="onOptionToggle('enabled')" class="fal fa-trash-alt u-ml-15 u-cursor-pointer u-fs-18 o-text--gray"></i>
        </div>
        <div class="l-flex u-ai-center">
          <span class="u-fs-11 u-mr-15">{{ enabled ? 'Enabled' : 'Disabled' }}</span>
          <label class="c-switch c-switch--sm" for="slack-enabled-toggle">
            <input
              type="checkbox"
              id="slack-enabled-toggle"
              name="slack-enabled-toggle"
              :checked="enabled"
              @click.prevent="onOptionToggle('enabled')"
              ref="enabled"
            />
            <span class="c-switch__slider"></span>
          </label>
        </div>
      </div>
      <div class="u-fs-11 u-text-italic u-mb-20" v-show="!enabled">
        Authorize Slack integration by clicking the Authorize button below.
      </div>
      <div class="u-mt-20" v-show="enabled">
        <ul class="c-list-group c-list-group--border-bottom">
          <li>
            <div class="u-space-between u-ai-center">
              <span class="u-mr-10">Finding Created</span>
              <label class="c-switch c-switch--sm" for="option_finding_created">
                <input
                  type="checkbox"
                  ref="option_finding_created"
                  id="option_finding_created"
                  name="option_finding_created"
                  :checked="integrationOptions.option_finding_created"
                  :value="integrationOptions.option_finding_created"
                  @click.prevent="onOptionToggle('option_finding_created')"
                />
                <span class="c-switch__slider"></span>
              </label>
            </div>
          </li>
          <li>
            <div class="u-space-between u-ai-center">
              <span class="u-mr-10">Finding Updated</span>
              <label class="c-switch c-switch--sm" for="option_finding_updated">
                <input
                  type="checkbox"
                  ref="option_finding_updated"
                  id="option_finding_updated"
                  name="option_finding_updated"
                  :checked="integrationOptions.option_finding_updated"
                  :value="integrationOptions.option_finding_updated"
                  @click.prevent="onOptionToggle('option_finding_updated')"
                />
                <span class="c-switch__slider"></span>
              </label>
            </div>
          </li>
          <li>
            <div class="u-space-between u-ai-center">
              <span class="u-mr-10">Finding Comment Created</span>
              <label class="c-switch c-switch--sm" for="option_finding_comment_created">
                <input
                  type="checkbox"
                  ref="option_finding_comment_created"
                  id="option_finding_comment_created"
                  name="option_finding_comment_created"
                  :checked="integrationOptions.option_finding_comment_created"
                  :value="integrationOptions.option_finding_comment_created"
                  @click.prevent="onOptionToggle('option_finding_comment_created')"
                />
                <span class="c-switch__slider"></span>
              </label>
            </div>
          </li>
          <li>
            <div class="u-space-between u-ai-center">
              <span class="u-mr-10">Finding Comment Updated</span>
              <label class="c-switch c-switch--sm" for="option_finding_comment_updated">
                <input
                  type="checkbox"
                  ref="option_finding_comment_updated"
                  id="option_finding_comment_updated"
                  name="option_finding_comment_updated"
                  :checked="integrationOptions.option_finding_comment_updated"
                  :value="integrationOptions.option_finding_comment_updated"
                  @click.prevent="onOptionToggle('option_finding_comment_updated')"
                />
                <span class="c-switch__slider"></span>
              </label>
            </div>
          </li>
        </ul>
      </div>
      <div class="u-mt-40" v-if="programUuid">
        <div v-if="!enabled && slackLink">
          <a target="_blank" rel="noopener noreferrer" :href="slackLink">
            <button class="o-btn o-btn--sm o-btn--primary o-btn--rounded-sm">
              <i class="fal fa-external-link u-mr-5 u-fs-12"></i>
              <span>Authorize</span>
            </button>
          </a>
        </div>
      </div>
    </div>
    <!-- /.c-box__box -->
  </div>
</template>

<script>
import { SlackIntegrationsMixin } from '@/modules/slack/mixins/SlackIntegrationsMixin'

export default {
  name: 'SlackIntegrations',
  mixins: [SlackIntegrationsMixin],
  data() {
    return {
      integrationOptions: {
        enabled: false,
        integration_type: false,
        option_finding_comment_created: false,
        option_finding_comment_updated: false,
        option_finding_created: false,
        option_finding_updated: false,
        setup_in_progress: false,
      },
      expanded: false,
      slackLink: '',
    }
  },
  props: {},
  computed: {
    enabled() {
      if (!this.program) {
        return false
      }
      const integrationUuid = this.program.slack_client_integration
      if (!integrationUuid || !integrationUuid.length) {
        return false
      }
      return true
    },
    cardClass() {
      return this.expanded ? '' : 'is-collapsed'
    },
    programUuid() {
      if (!this.$route || !this.$route.params) {
        return ''
      }
      return this.$route.params.uuid || ''
    },
  },
  methods: {
    async onOptionToggle(property) {
      // if slack has not been configured, toggle card to expand
      if (!this.enabled) {
        this.$caAlert.error('Please authorize Slack integration before enabling')
        return
      }
      try {
        const payload = {
          uuid: this.program.slack_client_integration,
          data: { [property]: !this.integrationOptions[property] },
        }
        const response = await this.actionEditClientIntegrations(payload)
        this.integrationOptions = response
      } catch (e) {
        this.$caAlert.error('Failed to update integration option')
      } finally {
        this.$refs[property].checked = this.integrationOptions[property] || false
      }
    },
    async loadProgram() {
      await this.actionLoadProgram(this.$route.params.uuid)
    },
    async refreshProgram() {
      if (!this.program.slack_client_integration) {
        await this.loadProgram()
      }
    },
  },
  async mounted() {
    await this.loadProgram()
    const integrationsUuid = this.program.slack_client_integration
    if (integrationsUuid) {
      const payload = { uuid: integrationsUuid }
      this.integrationOptions = await this.actionGetClientIntegrations(payload)
    } else {
      const response = await this.actionGetSlackLink({
        uuid: this.$route.params.uuid,
      })
      this.slackLink = response.data || ''
    }
    window.addEventListener('focus', this.refreshProgram)
  },
  beforeDestroy() {
    window.removeEventListener('focus', this.refreshProgram)
  },
}
</script>

<style lang="scss">
.slack-form {
  .c-submenu__link-text {
    display: inline-block;
    width: 200px;
    min-width: 200px;
  }
}
</style>
