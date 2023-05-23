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
import store from '@/modules/programs/_store'
import { FollowedProgramsMixin } from '@/mixins/followed-programs'

export const ProgramSettingsMixin = {
  data() {
    return {
      programSettingsLoading: false,
    }
  },
  mixins: [FollowedProgramsMixin],
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
    async onActiveProgramToggle() {
      const active = !this.program.active
      if (!active) {
        try {
          this.$solar.show()
          this.loading = true
          const response = await this.toggleActive(this.program.uuid)
          this.setProgram(response.data)
          this.$caAlert.createOrUpdate({
            type: 'success',
            text: 'This program is now <b>inactive</b>.',
          })
          this.$caAlert.close('program-status-warning')
          await this.actionLoadFollowedPrograms()
        } catch (e) {
          this.$caAlert.error('Failed to activate program.')
        } finally {
          this.$solar.hide()
          this.loading = false
        }
        return
      }

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
              this.setProgram(response.data)
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
            .finally(async () => {
              await this.actionLoadFollowedPrograms()
            })
        },
        cancelCallback: () => {
          this.$caDialog.close('program-activate-confirmation')
        },
        dialogClass: this.getUserTypeClass(),
      })
    },
    onVisibilityToggle() {
      this.$solar.show()
      this.programSettingsLoading = true
      this.toggleVisibility(this.program.uuid)
        .then(response => {
          this.setProgram(response.data)
          this.$caAlert.createOrUpdate({
            type: 'success',
            text: `This program is now <b>${this.program.private ? 'public' : 'private'}</b>.`,
          })
          this.$caAlert.close('program-status-warning')
          this.$solar.hide()
          this.programSettingsLoading = false
        })
        .catch(() => {
          this.$caAlert.error('Failed to update program visibility.')
          this.$solar.hide()
          this.programSettingsLoading = false
        })
    },
  },
  computed: {
    programIsActive() {
      if (!this.program || !this.program.active) {
        return false
      }
      return this.program.active === true
    },
    programIsPrivate() {
      if (!this.program || !this.program.private) {
        return false
      }
      return this.program.private === true
    },
    programIsFrozen() {
      if (!this.program || !this.program.frozen) {
        return false
      }
      return this.program.frozen === true
    },
  },
  mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
}
