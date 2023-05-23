<template>
  <div v-if="program && program.uuid">
    <researchers-block
      :loading="loading"
      :program="program"
      :searchText="researcherSearchText"
      :search-results="researcherSearchResults"
      :search-results-visible="showResearcherSearchResults"
      :researchers-selected="researchersSelected"
      @on-tag-click="onTagClick"
      @on-select-researcher-to-add="onSelectResearcherToAdd"
      @on-search-text-input-clicked="onInputClick"
      @on-click-outside-search-results="onClickOutsideResearcherResults"
      @on-search-text-input="onResearcherSearchTextInput"
      @on-send-invites-click="onSendInvitesClick"
      @on-researcher-action="onResearcherAction"
    />
  </div>
</template>

<script>
import store from '@/modules/programs/_store'
import ResearchersBlock from '@/modules/program-settings/_components/ResearchersBlock.vue'
import {
  STORE_KEY,
  GET_PROGRAM,
  TEAM_MEMBER_ACTION,
  SEARCH_PROGRAM_OWNERS,
  SEARCH_RESEARCHERS,
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
      researchersSelected: [],
      invitedResearchers: [],
      program: {},
      researcherSearchResults: [],
      researcherSearchText: '',
      researcherSearchResultsExpanded: false,
      pmSearchResultsExpanded: false,
      poSearchResultsExpanded: false,
      loading: false,
      defaultUserImage: DEFAULT_USER_IMAGE,
    }
  },
  components: {
    ResearchersBlock,
  },
  methods: {
    ...mapActions(STORE_KEY, {
      getProgram: GET_PROGRAM,
      teamMemberAction: TEAM_MEMBER_ACTION,
      dispatchSearchProgramOwners: SEARCH_PROGRAM_OWNERS,
      dispatchSearchResearchers: SEARCH_RESEARCHERS,
    }),
    onSelectResearcherToAdd(tag) {
      const index = this.program.invited.findIndex(x => x.uuid === tag.id)
      if (index > -1) {
        return
      }
      const selectedIndex = this.researchersSelected.findIndex(x => x.id === tag.id)
      if (selectedIndex > -1) {
        this.researcherSearchText = ''
        this.researcherSearchResults = []
        return
      }

      this.researchersSelected.push(tag)
      this.researcherSearchText = ''
      this.researcherSearchResults = []
      this.researcherSearchResultsExpanded = false
    },
    async onResearcherSearchTextInput(val) {
      this.researcherSearchText = val
      if (val === '') {
        this.researcherSearchResultsExpanded = false
        this.researcherSearchResults = []
      } else if (val.length > 2) {
        await this.processResearcherSearch(val)
      }
    },
    onTagClick(tag) {
      this.loading = true
      this.researchersSelected = this.researchersSelected.filter(x => x.text !== tag.text)

      setTimeout(() => {
        this.loading = false
      }, 300)
    },
    async processResearcherSearch(val) {
      this.$solar.show()
      try {
        const response = await this.dispatchSearchResearchers(val)
        this.researcherSearchResults = response.data
        this.researcherSearchResultsExpanded = true
      } catch (e) {
        this.$caAlert.error('Program manager search failed')
      } finally {
        this.$solar.hide()
      }
    },
    async onResearcherAction(data) {
      this.$solar.show()
      try {
        const payload = {
          programUuid: data.programUuid,
          profileUuid: data.researcher.uuid,
          action: data.action,
          userType: data.userType || '',
        }

        const response = await this.teamMemberAction(payload)
        this.$set(this.$data, 'program', response.data)

        let message = ''
        const action = data.action
        switch (action) {
          case 'add':
            message = `${data.researcher.user_name} has been added to this program.`
            break
          case 'remove':
            message = `${data.researcher.user_name} has been removed from this program.`
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

    onClickOutsideResearcherResults() {
      this.researcherSearchResultsExpanded = false
      this.researcherSearchText = ''
      this.researcherSearchResults = []
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
    onInputClick() {
      this.$nextTick(() => {
        this.researcherSearchResultsExpanded = !!(this.researcherSearchText && this.researcherSearchText.length > 0)
      }, 300)
    },
    async processInvite(invite) {
      let success = false
      try {
        const payload = {
          programUuid: this.program.uuid,
          profileUuid: invite.id,
          action: 'add',
          userType: 'researcher',
        }
        const response = await this.teamMemberAction(payload)
        this.program = response.data
        success = true
      } catch (e) {
        success = false
      }
      return success
    },
    async onSendInvitesClick() {
      this.$solar.show()
      this.loading = true
      await Promise.all(
        this.researchersSelected.map(async invite => {
          invite.loading = true
          await this.processInvite(invite)
          invite.loading = false
        })
      )

      this.researchersSelected = []
      this.$solar.hide()
      setTimeout(() => {
        this.loading = false
      }, 300)
    },
  },
  computed: {
    showResearcherSearchResults() {
      const results = this.researcherSearchResults
      return results && this.researcherSearchResultsExpanded
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
