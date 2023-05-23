<template>
  <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }]"
      @click="toggleDropdownMenu"
    >
      <span>{{ selectedSeverity || 'Severity' }}</span>
    </div>
    <ul class="c-dropdown__menu c-dropdown__menu--no-scroll" :class="{ 'is-visible': expanded }">
      <li v-if="!hideAllSeverities" @click="selectSeverity('')">All Severities</li>
      <li
        v-for="(severity, index) in severityOptions"
        :key="`severity-${index}`"
        @click="selectSeverity(severity.name)"
      >
        <span class="c-badge" :class="`c-badge--severity-${severity.displayName.toLowerCase()}`">
          {{ severity.displayName }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { AccountMixin } from 'mixins/account'
import { FindingMixin } from '@/modules/findings/_mixins/finding'
import { clickOutside } from '@/directives/click-outside'
import DateTimeFilters from '@/filters/date-time-filters'
import { FINDINGS_FILTER_OPTIONS } from '@/modules/findings/_models/findings-filter-options'

export default {
  name: 'FindingSeverityDropdown',
  components: {},
  directives: {
    clickOutside,
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin, FindingMixin],
  props: {
    selectedSeverity: {
      type: String,
      required: true,
    },
    hideAllSeverities: {
      type: Boolean,
      required: false,
    },
  },
  data() {
    return {
      expanded: false,
      publishFindingPanelVisible: false,
      showSubmissionPopover: false,
      searchModeEnabled: false,
      searchResults: [],
      searchTerms: '',
      selectedSubmissionUuid: '',
      showMetaMenu: false,
      now: new Date(),
      findingsFilterOptions: Object.values(FINDINGS_FILTER_OPTIONS),
      severityOptions: [
        { displayName: 'Critical', name: 'Critical' },
        { displayName: 'High', name: 'High' },
        { displayName: 'Medium', name: 'Medium' },
        { displayName: 'Low', name: 'Low' },
        { displayName: 'Info', name: 'Informational' },
      ],
      findingMetaForm: {
        resolution: undefined,
        priority: undefined,
      },
      initializing: false,
    }
  },
  computed: {
    allowEditingStatus() {
      if (!this.findingsFilterOptions || !this.findingMetaForm.resolution) {
        return false
      }
      return this.userIsProgramManager() || this.userIsAppOwner()
    },
    creatorUsername() {
      if (!this.finding || !this.finding.creator) {
        return 'User'
      }

      return this.finding.creator.username || 'User'
    },
  },
  methods: {
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
    selectSeverity(severity) {
      this.expanded = false
      this.$emit('set-priority-query', severity)
    },
    async addOrRemoveVulnerabilityType(vulnerabilityType) {
      try {
        const payload = {
          findingUuid: this.finding.uuid,
          vulnerabilityTypeUuid: vulnerabilityType.uuid,
        }

        await this.actionEditVulnerabilityTypes(payload)
      } catch (e) {
        this.$caAlert.error('Failed to set vulnerability type.')
      }
    },
    async completeFinding(resolution) {
      try {
        this.$solar.show()
        const payload = {
          uuid: this.finding.uuid,
          resolution: resolution,
        }
        await this.actionEditFinding(payload)
        // this.selectedResolution = this.finding.resolution;
        this.$caAlert.success('Finding completed successfully.')
        this.$solar.hide()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to complete finding'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
      }
    },
    async updateFindingSeverity(severity) {
      try {
        this.$solar.show()
        const payload = {
          uuid: this.finding.uuid,
          priority: severity.id,
        }
        await this.actionEditFinding(payload)
        this.$caAlert.success('Finding severity updated.')
        this.$solar.hide()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to update finding severity'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
      }
    },
    closeMetaMenu() {
      this.showMetaMenu = false
    },
    closeSubmissionPopover(e, targetId) {
      if (!targetId || !targetId.includes('ca-alert')) {
        this.showSubmissionPopover = false
      }
    },
    onCancelSearch() {
      this.searchTerms = ''
      this.searchResults = []
      this.selectedSubmissionUuid = ''
      this.searchModeEnabled = false
    },
    onClearSearch() {
      this.searchTerms = ''
      this.selectedSubmissionUuid = ''
      this.searchResults = []
    },
    async deleteFindingClick() {
      await this.actionDeleteFinding(this.finding.uuid)
      this.$caAlert.close('finding-deleted')
      this.$caAlert.createOrUpdate({
        id: 'finding-deleted',
        type: 'success',
        text: 'Finding deleted',
      })
      this.$router.go(-1)
    },
    async followFindingClick() {
      await this.actionFollowFinding(this.finding.uuid)
      await this.actionLoadProfile()
      const action = this.isFollowingFinding(this.finding.uuid) ? 'Followed' : 'Unfollowed'
      this.$caAlert.close('finding-follow-alert')
      this.$caAlert.createOrUpdate({
        id: 'finding-follow-alert',
        type: 'success',
        text: `${action} finding successfully.`,
      })
    },
    editFindingClick() {
      const params = {
        findingUuid: this.finding.uuid,
        programUuid: this.finding.program.uuid,
      }
      this.$router.push({
        name: 'EditFinding',
        params: params,
      })
    },
    goToSubmission() {
      this.$router.push({
        name: 'Submission',
        params: { uuid: this.finding.submission.uuid },
      })
    },
    markCompleteClick(e) {
      this.completeFindingPanelVisible = true
    },
    async updateFindingResolution(resolution) {
      try {
        this.$solar.show()
        const payload = {
          uuid: this.finding.uuid,
          resolution: resolution.id,
        }
        await this.actionEditFinding(payload)
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to update finding resolution.'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
      }
    },
    async markFindingIncomplete() {
      try {
        this.$solar.show()
        this.loading = true
        const payload = {
          uuid: this.finding.uuid,
          resolution: 1,
        }
        await this.actionEditFinding(payload)
        this.$caAlert.success('Finding resolution updated.')
        this.$solar.hide()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to update finding resolution.'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
        this.loading = false
      }
    },
    onPublishFindingPanelCancel() {
      this.publishFindingPanelVisible = false
    },
    async onSearchTermsInput(val) {
      this.searchTerms = val
      const response = await this.actionSearchSubmissions({
        programUuid: this.finding.program.uuid,
        title: this.searchTerms,
      })
      this.searchResults = response.data.results
    },
    onSetSelectedSubmission(val) {
      this.selectedSubmissionUuid = val
    },
    async publishFinding() {
      try {
        this.$solar.show()
        this.loading = true
        const payload = {
          findingUuid: this.finding.uuid,
        }
        await this.actionPublishFinding(payload)
        this.publishFindingPanelVisible = false
        this.$caAlert.success('Finding published successfully.')
        this.$solar.hide()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to publish finding'
        this.$caAlert.error(error)
        this.publishFindingPanelVisible = false
      } finally {
        this.$solar.hide()
        this.loading = false
      }
    },
    async showPublishFindingPanel(submissionUuid) {
      this.publishFindingPanelVisible = true
    },
    toggleFindingLinking() {
      this.showMetaMenu = false
      this.actionToggleLinkingFinding()
    },
    toggleSearchMode() {
      this.searchModeEnabled = !this.searchModeEnabled
    },
    toggleSubmissionPopover() {
      if (!this.showSubmissionPopover) {
        this.showMetaMenu = false
      }
      this.showSubmissionPopover = !this.showSubmissionPopover
    },
    toggleMetaMenu() {
      this.showSubmissionPopover = false
      this.showMetaMenu = !this.showMetaMenu
    },
    async linkFindingToSubmission(uuid) {
      this.$solar.show()
      try {
        const submissionUuid = this.findingSubmission ? this.findingSubmission.uuid : uuid
        const findingUuid = this.finding.uuid
        const payload = {
          submissionUuid: submissionUuid,
          findingUuid: findingUuid,
        }
        await this.actionLinkFindingSubmission(payload)
        const alertOptions = {
          id: 'submission-finding-link-alert',
          buttons: [
            {
              text: 'Unlink Submission',
              callback: async () => {
                await this.unlinkFindingFromSubmission(submissionUuid)
              },
            },
          ],
        }
        this.$caAlert.close('submission-finding-unlink-alert')
        this.$caAlert.success('Linked submission successfully.', alertOptions)
      } catch (e) {
        this.$caAlert.error('Linking submission failed.')
      } finally {
        this.$solar.hide()
      }
    },
    async unlinkFindingFromSubmission(uuid) {
      this.$solar.show()

      try {
        const submissionUuid = this.findingSubmission ? this.findingSubmission.uuid : uuid
        const findingUuid = this.finding.uuid
        const payload = {
          submissionUuid: submissionUuid,
          findingUuid: findingUuid,
        }
        await this.actionLinkFindingSubmission(payload)
        const alertOptions = {
          id: 'submission-finding-unlink-alert',
          buttons: [
            {
              text: 'Relink Submission',
              callback: async () => {
                await this.linkFindingToSubmission(submissionUuid)
              },
            },
          ],
        }
        this.$caAlert.close('submission-finding-link-alert')
        this.$caAlert.success('Finding unlinked from submission successfully.', alertOptions)
      } catch (e) {
        this.$caAlert.error('Unlinking submission failed.')
      } finally {
        this.$solar.hide()
        this.onCancelSearch()
      }
    },
  },
  async mounted() {
    await this.actionLoadFindingPriorities()
    this.findingsFilterOptions.shift()
    this.initializing = true
    const resolution = this.findingsFilterOptions.find((x) => x.id === this.finding.resolution)
    const priority = this.findingPriorities.find((x) => x.name === this.finding.priority)
    this.findingMetaForm = {
      resolution: resolution,
      priority: priority,
    }
    this.initializing = false
  },
}
</script>
