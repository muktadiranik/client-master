<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap l-wrap--750">
        <submission-template
          v-if="program && program.uuid"
          :program="program"
          @on-reset-submission-template="onResetSubmissionTemplate"
          @on-save-submission-template="onSaveSubmissionTemplate"
        />
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import store from '@/modules/programs/_store'
import { NavbarMixin } from '@/mixins/navbar'
import SubmissionTemplate from '@/modules/program-settings/_components/SubmissionTemplate'
import { STORE_KEY, EDIT_PROGRAM, GET_PROGRAM } from '@/modules/programs/_store/types'
import { mapActions } from 'vuex'
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'

export default {
  name: 'ProgramSettingsSubmissionTemplate',
  mixins: [AccountMixin, BreadcrumbsMixin, NavbarMixin],
  data() {
    return {
      program: {},
      loading: false,
    }
  },
  components: {
    SubmissionTemplate,
  },
  methods: {
    ...mapActions(STORE_KEY, {
      editProgram: EDIT_PROGRAM,
      getProgram: GET_PROGRAM,
    }),
    async onSaveSubmissionTemplate(submissionTemplate) {
      try {
        let payload = {
          ...this.program,
        }

        payload.submission_template = submissionTemplate
        await this.editProgram(payload)
        this.$caAlert.success('Saved submission template')
      } catch (e) {
        this.$caAlert.error('Failed to save submission template')
      }
    },
    async onResetSubmissionTemplate(submissionTemplate) {
      try {
        let payload = {
          ...this.program,
        }

        payload.submission_template = submissionTemplate

        await this.editProgram(payload)
        this.$caDialog.close('reset-template-confirmation')
        this.$caAlert.success('This submission template has been reset to default settings.')
      } catch (e) {
        this.$caAlert.error('Failed to reset submission template to default settings.')
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
      this.program = response.data
      await this.actionLoadProgramForNavbar(this.program)
      document.title = `Inspectiv | ${this.program.title}`

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
}
</script>
