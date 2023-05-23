<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap l-wrap--750">
        <program-settings-general
          :program="program"
          :researcher-search-text="researcherSearchText"
          :researcher-search-results="researcherSearchResults"
          :program-actions-disabled="loading"
          @on-researcher-action="onResearcherAction"
          @on-active-program-toggle="onActiveToggle"
          @on-toggle-visibility="onVisibilityToggle"
          @on-freeze-program-toggle="onFreezeProgramToggle"
          @on-researcher-search-text-input="onResearcherSearchTextInput"
        />
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import store from '@/modules/programs/_store'
import ProgramSettingsGeneral from '@/modules/program-settings/_components/ProgramSettingsGeneral'
import {
  STORE_KEY,
  EDIT_PROGRAM,
  GET_PROGRAM,
  TEAM_MEMBER_ACTION,
  TOGGLE_ACTIVE,
  TOGGLE_FREEZE,
  TOGGLE_VISIBILITY,
  SEARCH_RESEARCHERS,
} from '@/modules/programs/_store/types'
import { mapActions } from 'vuex'
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { NavbarMixin } from '@/mixins/navbar'
import { FollowedProgramsMixin } from '@/mixins/followed-programs'

export default {
  name: 'ProgramSettings',
  mixins: [AccountMixin, BreadcrumbsMixin, FollowedProgramsMixin, NavbarMixin],
  data() {
    return {
      program: {},
      researcherSearchText: '',
      researcherSearchResults: [],
      loading: false,
    }
  },
  components: {
    ProgramSettingsGeneral,
  },
  methods: {
    ...mapActions(STORE_KEY, {
      editProgram: EDIT_PROGRAM,
      getProgram: GET_PROGRAM,
      teamMemberAction: TEAM_MEMBER_ACTION,
      toggleActive: TOGGLE_ACTIVE,
      toggleFreeze: TOGGLE_FREEZE,
      toggleVisibility: TOGGLE_VISIBILITY,
      searchResearchers: SEARCH_RESEARCHERS,
    }),
    async onActiveToggle() {
      const active = this.program.active
      if (active) {
        try {
          this.$solar.show()
          this.loading = true
          const response = await this.toggleActive(this.program.uuid)
          this.program = response.data
          this.$caAlert.createOrUpdate({
            type: 'success',
            text: 'This program is now <b>inactive</b>.',
          })
          this.$caAlert.close('program-status-warning')
          await this.actionLoadFollowedPrograms()
        } catch (e) {
          this.$caAlert.error('Failed to deactivate program.')
        } finally {
          this.$solar.hide()
          this.loading = false
        }
      } else {
        this.$caDialog.confirm({
          id: 'program-activate-confirmation',
          title: 'Activate Program?',
          text: `Are you sure you want to activate this program?
          When activated, security researchers will be able to see this program and create new submissions.`,
          confirmButtonText: 'Activate Program',
          confirmCallback: () => {
            this.$solar.show()
            this.loading = true
            this.toggleActive(this.program.uuid)
              .then(response => {
                this.program = response.data
                this.$caDialog.close('program-activate-confirmation')
                this.$caAlert.createOrUpdate({
                  type: 'success',
                  text: 'This program is now <b>active</b>.',
                })
                this.$solar.hide()
                this.loading = false
              })
              .catch(e => {
                this.$caAlert.error('Failed to deactivate program')
                this.$caDialog.close('program-activate-confirmation')
                this.$solar.hide()
                this.loading = false
              })
          },
          cancelCallback: () => {
            this.$caDialog.close('program-activate-confirmation')
          },
          dialogClass: this.getUserTypeClass(),
        })
      }
    },
    async onResearcherSearchTextInput(value) {
      this.$solar.show()
      try {
        this.researcherSearchText = value || ''
        if (!value) {
          return
        }
        const response = await this.searchResearchers(value)
        let results = response.data
        let researchers = []
        for (let i = 0, len = results.length; i < len; i++) {
          const existing = this.program.invited.find(x => x.uuid === results[i].uuid)

          if (!existing) {
            researchers.push(results[i])
          }
        }

        this.researcherSearchResults = researchers
      } catch (e) {
      } finally {
        this.$solar.hide()
      }
    },
    onFreezeProgramToggle() {
      const freezing = !this.program.frozen
      if (!freezing) {
        this.$solar.show()
        this.loading = true
        this.toggleFreeze(this.program.uuid)
          .then(response => {
            this.program = response.data
            this.$caAlert.createOrUpdate({
              type: 'success',
              text: 'This program has been <b>unfrozen</b>.',
            })
            this.$caAlert.close('program-status-warning')
            this.$solar.hide()
            this.loading = false
          })
          .catch(e => {
            this.$caAlert.error('Failed to unfreeze program.')
            this.$solar.hide()
            this.loading = false
          })
        return
      }

      this.$caDialog.confirm({
        id: 'program-freeze-confirmation',
        title: 'Freeze Program?',
        text: `Are you sure you want to freeze this program?
          When frozen, security researchers will no longer be able to create submissions.`,
        confirmButtonText: 'Freeze Program',
        confirmCallback: () => {
          this.$solar.show()
          this.loading = true
          this.toggleFreeze(this.program.uuid)
            .then(response => {
              this.program = response.data
              this.$caDialog.close('program-freeze-confirmation')
              this.$caAlert.createOrUpdate({
                type: 'success',
                text: 'This program is now <b>frozen</b>.',
              })
              this.$caAlert.close('program-status-warning')
              this.$solar.hide()
              this.loading = false
            })
            .catch(e => {
              this.$caAlert.error('Failed to freeze program')
              this.$caDialog.close('program-freeze-confirmation')
              this.$solar.hide()
              this.loading = false
            })
        },
        cancelCallback: () => {
          this.$caDialog.close('program-freeze-confirmation')
        },
        dialogClass: this.getUserTypeClass(),
      })
    },
    onVisibilityToggle() {
      this.$solar.show()
      this.loading = true
      this.toggleVisibility(this.program.uuid)
        .then(response => {
          this.program = response.data
          this.$caAlert.createOrUpdate({
            type: 'success',
            text: `This program is now <b>${this.program.private ? 'private' : 'public'}</b>.`,
          })
          this.$caAlert.close('program-status-warning')
          this.$solar.hide()
          this.loading = false
        })
        .catch(() => {
          this.$caAlert.error('Failed to update program visibility.')
          this.$solar.hide()
          this.loading = false
        })
    },
    async onResearcherAction(data) {
      const payload = {
        programUuid: this.program.uuid,
        profileUuid: data.researcher.uuid,
        action: data.action,
        userType: 'researcher',
      }

      try {
        const response = await this.teamMemberAction(payload)
        this.program = response.data

        const researcherUsername = data.researcher.user_name

        const msg =
          payload.action === 'add'
            ? `Invited ${researcherUsername} to the program`
            : `Removed ${researcherUsername} from the program`

        this.$caAlert.success(msg)
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : `Failed to ${payload.action} researcher`

        this.$caAlert.error(error)
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

      this.actionSetBreadcrumbs({
        parent: {
          route: this.$router.resolve({ name: 'Programs' }).route,
        },
        child: {
          title: this.program.title,
          route: this.$router.resolve({ name: 'Program', params: { uuid: this.program.uuid } }).route,
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
      document.title = `Inspectiv | ${this.program.title}`
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
