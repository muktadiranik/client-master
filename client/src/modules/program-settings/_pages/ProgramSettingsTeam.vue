<template>
  <div v-if="program && program.uuid">
    <team-program-owners-block
      :loading="loading"
      :program="program"
      :searchText="programOwnerSearchText"
      :search-results="programOwnerSearchResults"
      :search-results-visible="showProgramOwnerSearchResults"
      :pending-invites="programOwnerPendingInvites"
      @on-tag-click="onTagClick"
      @on-add-pending-invite="onAddPendingInvite"
      @on-search-text-input-clicked="onPoInputClick"
      @on-click-outside-search-results="onClickOutsidePoResults"
      @on-search-text-input="onProgramOwnerSearchTextInput"
      @on-send-invites-click="onSendInvitesClick"
      @on-resend-invitation-click="resendInvitation"
      @on-team-member-action="onTeamMemberAction"
      @on-cancel-invitation-click="onCancelInvitation"
    />
    <!-- <team-program-managers-block
      :loading="loading"
      :program="program"
      :searchText="programManagerSearchText"
      :search-results="programManagerSearchResults"
      :search-results-visible="showProgramManagerSearchResults"
      @on-search-text-input-clicked="onPmInputClick"
      @on-click-outside-search-results="onClickOutsidePmResults"
      @on-search-text-input="onProgramManagerSearchTextInput"
      @on-team-member-action="onTeamMemberAction"
    /> -->
  </div>
</template>

<script>
import store from '@/modules/programs/_store'
import TeamProgramOwnersBlock from '@/modules/program-settings/_components/TeamProgramOwnersBlock.vue'
// import TeamProgramManagersBlock from '@/modules/program-settings/_components/TeamProgramManagersBlock.vue'
import {
  STORE_KEY,
  GET_PROGRAM,
  TEAM_MEMBER_ACTION,
  INVITE_PROGRAM_OWNER,
  SEARCH_PROGRAM_MANAGERS,
  SEARCH_PROGRAM_OWNERS,
  CANCEL_INVITATION,
} from '@/modules/programs/_store/types'
import { mapActions } from 'vuex'
import { AccountMixin } from '@/mixins/account'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { clickOutside } from '@/directives/click-outside'
import { NavbarMixin } from '@/mixins/navbar'
import validators from '@/mixins/validators'

export default {
  name: 'ProgramSettingsTeam',
  directives: { clickOutside },
  mixins: [AccountMixin, BreadcrumbsMixin, validators, NavbarMixin],
  data() {
    return {
      programOwnerPendingInvites: [],
      program: {},
      programManagerSearchText: '',
      programManagerSearchResults: [],
      programOwnerSearchText: '',
      programOwnerSearchResults: [],
      pmSearchResultsExpanded: false,
      poSearchResultsExpanded: false,
      loading: false,
      defaultUserImage: DEFAULT_USER_IMAGE,
    }
  },
  components: {
    // TeamProgramManagersBlock,
    TeamProgramOwnersBlock,
  },
  methods: {
    ...mapActions(STORE_KEY, {
      getProgram: GET_PROGRAM,
      teamMemberAction: TEAM_MEMBER_ACTION,
      dispatchSearchProgramManagers: SEARCH_PROGRAM_MANAGERS,
      dispatchSearchProgramOwners: SEARCH_PROGRAM_OWNERS,
      inviteProgramOwner: INVITE_PROGRAM_OWNER,
      actionCancelInvitation: CANCEL_INVITATION,
    }),
    onAddPendingInvite(tag) {
      const index = this.programOwnerPendingInvites.findIndex(x => x.id === tag.id)
      if (index > -1) {
        return
      }

      if (!this.emailIsValid(tag.id) && !this.uuidIsValid(tag.id)) {
        return
      }

      this.programOwnerPendingInvites.push(tag)
      this.programOwnerSearchText = ''
      this.programOwnerSearchResults = []
      this.poSearchResultsExpanded = false
    },
    async onProgramOwnerSearchTextInput(val) {
      this.programOwnerSearchText = val
    },
    async onProgramManagerSearchTextInput(val) {
      this.programManagerSearchText = val

      if (val) {
        await this.processProgramManagerSearch(val)
      } else {
        this.programManagerSearchResults = []
        this.pmSearchResultsExpanded = false
      }
    },
    onTagClick(tag) {
      this.loading = true
      this.programOwnerPendingInvites = this.programOwnerPendingInvites.filter(x => x.text !== tag.text)

      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    async processProgramManagerSearch(val) {
      this.$solar.show()
      try {
        const response = await this.dispatchSearchProgramManagers(val)
        this.programManagerSearchResults = response.data
        this.pmSearchResultsExpanded = true
      } catch (e) {
        this.$caAlert.error('Program manager search failed')
      } finally {
        this.$solar.hide()
      }
    },
    async processProgramOwnerSearch(val) {
      this.$solar.show()
      try {
        const response = await this.dispatchSearchProgramOwners(val)
        this.programOwnerSearchResults = response.data
        this.poSearchResultsExpanded = true
      } catch (e) {
        this.$caAlert.error('Program manager search failed')
      } finally {
        this.$solar.hide()
      }
    },
    async onTeamMemberAction(data) {
      this.$solar.show()
      try {
        const payload = {
          programUuid: data.programUuid,
          profileUuid: data.teamMember ? data.teamMember.uuid : '',
          action: data.action,
          userType: data.userType || '',
        }

        const response = await this.teamMemberAction(payload)
        this.$set(this.$data, 'program', response.data)

        let message = ''
        const name = `${data.teamMember.first_name} ${data.teamMember.last_name}`
        const action = data.action
        switch (action) {
          case 'add':
            message = `${name} has been added to the program team.`
            break
          case 'remove':
            message = `${name} has been removed from the program team.`
            break
          default:
            message = 'Success'
            break
        }
        this.$caAlert.success(message)
      } catch (e) {
        const msg = e && e.data && e.data.error ? e.data.error : 'Failed to update program'
        this.$caAlert.error(msg)
      } finally {
        this.$solar.hide()
        this.pmSearchResultsExpanded = false
      }
    },
    onClickOutsidePmResults() {
      this.pmSearchResultsExpanded = false
    },
    onClickOutsidePoResults() {
      this.poSearchResultsExpanded = false
    },
    onPmInputClick() {
      this.$nextTick(() => {
        this.pmSearchResultsExpanded = !!(
          this.programManagerSearchText &&
          this.programManagerSearchText.length > 0 &&
          this.programManagerSearchResults.length > 0
        )
      }, 300)
    },
    onPoInputClick() {
      this.$nextTick(() => {
        this.poSearchResultsExpanded = !!(this.programOwnerSearchText && this.programOwnerSearchText.length > 0)
      }, 300)
    },
    async processInvite(invite) {
      let success = false
      try {
        if (this.emailIsValid(invite.id)) {
          const response = await this.inviteProgramOwner({
            programUuid: this.program.uuid,
            emailAddress: invite.id,
            userType: 'application_owner',
          })

          this.program = response.data
          success = true
        } else {
          const payload = {
            programUuid: this.program.uuid,
            profileUuid: invite.id,
            action: 'add',
            userType: 'application_owner',
          }

          const response = await this.teamMemberAction(payload)
          this.program = response.data
          success = true
        }
      } catch (e) {
        success = false
      }
      return success
    },
    async onSendInvitesClick() {
      this.$solar.show()
      const pendingInvites = this.programOwnerPendingInvites

      this.loading = true
      await Promise.all(
        pendingInvites.map(async invite => {
          invite.loading = true
          const success = await this.processInvite(invite)
          invite.loading = false

          if (success) {
            this.programOwnerPendingInvites = this.programOwnerPendingInvites.filter(x => x.id !== invite.id)
          }
        })
      )

      this.$solar.hide()
      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    async resendInvitation(invite) {
      try {
        this.$solar.show()

        const response = await this.inviteProgramOwner({
          programUuid: this.program.uuid,
          emailAddress: invite.email,
          userType: invite.user_type,
        })
        this.program = response.data

        this.$caAlert.success(`Invitation to ${invite.email} has been resent.`)
      } catch (e) {
        this.$caAlert.error('Failed to resend invitation')
      } finally {
        this.$solar.hide()
      }
    },
    async onCancelInvitation(email) {
      try {
        const payload = { email, program_uuid: this.program.uuid }
        await this.actionCancelInvitation(payload)
        const response = await this.getProgram(this.$route.params.uuid)
        this.$set(this.$data, 'program', response.data)
      } catch (error) {
        this.$caAlert.error('Error canceling invitation')
      }
    },
  },
  computed: {
    showProgramManagerSearchResults() {
      const results = this.programManagerSearchResults
      return results && this.pmSearchResultsExpanded
    },
    showProgramOwnerSearchResults() {
      const results = this.programOwnerSearchResults
      return results && this.poSearchResultsExpanded
    },
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }

    this.$solar.show()

    try {
      const response = await this.getProgram(this.$route.params.uuid)
      this.$set(this.$data, 'program', response.data)
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
          }),
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
  created() {
    // this.processProgramManagerSearch = debounce(this.processProgramManagerSearch, 400)
    // this.processProgramOwnerSearch = debounce(this.processProgramOwnerSearch, 400)
  },
  destroyed() {
    const nextRoute = (this.$router.history.current.name || '').toLowerCase()
    if (!nextRoute.includes('program') || nextRoute === 'programs' || nextRoute === 'programcreate') {
      this.$caAlert.close('program-status-warning')
    }
  },
}
</script>
