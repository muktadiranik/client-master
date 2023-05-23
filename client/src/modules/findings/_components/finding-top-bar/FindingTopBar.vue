<template>
  <div>
    <router-link data-html2canvas-ignore :to="{ name: 'Findings' }">
      <button class="u-ml--16 u-mb-20 o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center">
        <i class="fal fa-arrow-left o-btn--icon-sm"></i>
        Back
      </button>
    </router-link>
    <div class="u-mb-20">
      <div>
        <div class="u-space-between u-ai-center u-nm-10">
          <div class="u-m-10">
            <div class="l-flex u-ai-center">
              <h1 class="u-font-22 o-text--500">{{ finding.title }}</h1>
            </div>
            <div class="u-font-12 u-mt-8 u-d-f u-ai-center">
              <div v-if="finding.program && finding.program.title">
                <router-link class="o-text--dark" :to="{ name: 'Program', params: { uuid: finding.program.uuid } }">
                  <i>{{ finding.program.title }}</i>
                </router-link>
              </div>
            </div>
          </div>
          <div class="u-m-10 u-d-f-below-768 u-width-full-below-768 u-jc-fe">
            <button class="o-btn o-btn--primary-light o-btn--rounded o-btn--sm" @click="downloadPDF">

              <span>Download as PDF</span>
            </button>
            <button
              v-if="finding.resolution === 1 || finding.resolution === 5"
              class="o-btn o-btn--primary o-btn--rounded o-btn--sm"
              @click="updateResolution(4)"
            >
              Move to In Progress
            </button>
            <button
              v-if="finding.resolution === 4"
              class="o-btn o-btn--primary o-btn--rounded o-btn--sm"
              @click="toggleModal"
            >
              Close Finding
            </button>
          </div>
        </div>
      </div>
      <ConfirmationModal
        :visible="modal.showModal"
        :type="modal.modalType"
        @on-complete-submission="updateResolution"
        @cancel-click="toggleModal"
      />
      <!-- .c-box__header -->
    </div>
    <!-- .c-box -->
  </div>
</template>

<script>
import { AccountMixin } from 'mixins/account'
import { FindingMixin } from '@/modules/findings/_mixins/finding'
import { clickOutside } from '@/directives/click-outside'
import DateTimeFilters from '@/filters/date-time-filters'
import { FINDINGS_FILTER_OPTIONS } from '@/modules/findings/_models/findings-filter-options'
import ConfirmationModal from '@/modules/findings/_components/findings-kanban/FindingsKanbanModal'

export default {
  name: 'FindingTopBar',
  components: {
    ConfirmationModal,
  },
  directives: {
    clickOutside,
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin, FindingMixin],
  props: {
    resolutionText: {
      type: String,
    },
  },
  data() {
    return {
      publishFindingPanelVisible: false,
      showSubmissionPopover: false,
      searchModeEnabled: false,
      searchResults: [],
      searchTerms: '',
      selectedSubmissionUuid: '',
      showMetaMenu: false,
      now: new Date(),
      findingsFilterOptions: Object.values(FINDINGS_FILTER_OPTIONS),
      findingMetaForm: {
        resolution: undefined,
        priority: undefined,
      },
      initializing: false,
      modal: {
        showModal: false,
        modalType: 'finding-detail',
        finding: '',
      },
    }
  },
  computed: {
    selectedFindingResolution() {
      return this.findingsFilterOptions.find((x) => x.id === this.finding.resolution)
    },
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
    // resolutionText() {
    //   const resolution = getFindingResolutionById(this.finding.resolution)
    //   return resolution.name
    // },
  },
  methods: {
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
    toggleModal() {
      this.modal.showModal = !this.modal.showModal
    },
    updateResolution(resolution) {
      this.$emit('update-finding-resolution', resolution)
      if (this.modal.showModal) {
        this.toggleModal()
      }
    },
    downloadPDF() {
      this.$emit('download-pdf')
    }
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
