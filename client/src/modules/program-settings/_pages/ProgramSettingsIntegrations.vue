<template>
  <div>
    <div class="u-mb-20">
      <JiraAuthenticationForm />
    </div>
    <SlackIntegrations />

    <!-- TRELLO -->
    <!-- <div class="c-box u-mt-20">
      <div class="c-box__header c-box__header--no-border-bottom">
        <div class="c-box__header__text">Trello</div>
      </div>

      <div class="c-box__body">
        <div class="u-space-between u-ai-center">
          <div class="c-badge--integration">
            <i class="fab fa-trello u-fs-24" style="color: #0079bf"></i>
            <span class="u-ml-10">Trello coming soon</span>
          </div>
          <div class="l-flex u-ai-center">
            <span class="u-fs-11 u-mr-15">Enabled</span>
            <label class="c-switch c-switch--sm">
              <input type="checkbox" />
              <span class="c-switch__slider"></span>
            </label>
          </div>
        </div>
      </div>
    </div> -->
  </div>
</template>

<script>
import store from '@/modules/programs/_store'
import { STORE_KEY, GET_PROGRAM } from '@/modules/programs/_store/types'
import { mapActions } from 'vuex'
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { clickOutside } from '@/directives/click-outside'
import validators from '@/mixins/validators'
import JiraAuthenticationForm from '@/modules/jira/components/JiraAuthenticationForm'
import { IntegrationsServiceMixin } from '@/modules/jira/mixins/IntegrationsServiceMixin'
import { NavbarMixin } from '@/mixins/navbar'
import SlackIntegrations from '@/modules/slack/components/SlackIntegrations'

export default {
  name: 'ProgramSettingsTeam',
  directives: { clickOutside },
  mixins: [AccountMixin, BreadcrumbsMixin, validators, IntegrationsServiceMixin, NavbarMixin],
  data() {
    return {
      program: {},
      jiraFieldMapForm: {},
    }
  },
  components: {
    JiraAuthenticationForm,
    SlackIntegrations,
  },
  methods: {
    ...mapActions(STORE_KEY, {
      getProgram: GET_PROGRAM,
    }),
    async onMapFieldSelected(fm) {
      this.$solar.show()
      try {
        const cesppaField = fm.cesppaField
        const jiraField = fm.jiraField

        this.jiraFieldMapForm[cesppaField] = jiraField
        const payload = this.getFieldMapForm()
        await this.actionSaveFieldMappings(payload)
        this.$caAlert.success('Field map saved')
      } catch (e) {
        this.$caAlert.error(e)
        const error = e.data && e.data.error ? e.data.error : 'Failed to update field map'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
        this.refreshJiraFieldMapForm()
      }
    },
    getFieldMapForm() {
      let mappedFields = []
      let mappedCesppaFields = Object.keys(this.jiraFieldMapForm)
      for (let cesppaField of mappedCesppaFields) {
        const jiraField = this.jiraFieldMapForm[cesppaField]
        if (!jiraField.id) {
          continue
        }
        const mappedField = {
          cesppa_field: cesppaField,
          jira_field: jiraField.name,
          jira_field_id: jiraField.id,
        }
        mappedFields.push(mappedField)
      }
      return mappedFields
    },
    refreshJiraFieldMapForm() {
      this.jiraFieldMapForm = {}
      if (!this.jiraProgram) {
        return
      }
      const mappedFields = this.jiraProgram.mapped_fields
      if (!mappedFields) {
        return
      }
      for (let c of this.cesppaFields) {
        const cesppaFieldName = c.name
        const mappedField = mappedFields.find((x) => x.cesppa_field === cesppaFieldName)
        let jiraField = {}
        if (mappedField) {
          jiraField = this.jiraFields.find((x) => x.name === mappedField.jira_field)
        }
        this.jiraFieldMapForm[cesppaFieldName] = jiraField || {}
      }
    },
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }

    this.$solar.show()

    try {
      const response = await this.getProgram(this.$route.params.uuid)
      const program = response.data
      this.$set(this.$data, 'program', program)
      await this.actionLoadProgramForNavbar(response.data)
      document.title = `Inspectiv | ${this.program.title}`

      this.$solar.show()
      await this.resetAuthorizationState()
      await this.actionSetProgram(this.program)
      if (this.program.jira_program_id) {
        await this.actionLoadJiraProgram()
        // this.refreshJiraFieldMapForm()
      }

      this.actionSetBreadcrumbs({
        parent: {
          route: this.$router.resolve({ name: 'Programs' }).route,
        },
        child: {
          title: this.program.title,
          route: this.$router.resolve({
            name: 'Program',
            params: { uuid: this.program.uuid },
          }).route,
          copyValue: this.program.uuid,
        },
        grandChild: {
          title: 'Settings',
          route: this.$route,
        },
      })
    } catch (e) {
      const error = e && e.data && e.data.error ? e.data.error : 'Failed to load program'
      this.$caAlert.error(error)
    } finally {
      this.$solar.hide()
    }
  },
  destroyed() {
    const nextRoute = (this.$router.history.current.name || '').toLowerCase()
    if (!nextRoute.includes('program') || nextRoute === 'programs' || nextRoute === 'programcreate') {
      this.$caAlert.close('program-status-warning')
    }
  },
  created() {
    this.actionLoadProgramPublishedFindings(this.$route.params.uuid)
  },
}
</script>
