<style>
code {
  display: block;
  white-space: pre-wrap;
  white-space: -moz-pre-wrap;
  white-space: -pre-wrap;
  white-space: -o-pre-wrap;
  word-wrap: break-word;
}
</style>

<template>
  <main class="c-site-main" v-on:keyup.esc="onPublishFindingPanelCancel">
    <section class="u-pt-20 u-pb-20" v-if="finding && finding.uuid">
      <div ref="content" class="l-wrap">
        <div data-html2canvas-ignore class="u-mb-20" v-if="findingIsDraft && userIsProgramManager()">
          <PublishFindingBar :loading="loading" @on-publish-finding-click="showPublishFindingPanel" />
        </div>
        <div class="u-mb-24">
          <FindingTopBar @update-finding-resolution="updateFindingResolution" @download-pdf="downloadPDF" :resolution-text="resolutionText" />
        </div>
        <div class="c-report l-submission-details">
          <div>
            <PublishFindingPanel
              v-if="userIsProgramManager()"
              :loading="loading"
              :visible="publishFindingPanelVisible"
              @on-publish-finding="publishFinding"
              @cancel-click="onPublishFindingPanelCancel"
            />
            <div data-html2canvas-add class="c-box">
              <div class="c-box__header u-d-f u-ai-center u-jc-sb">
                <h6 class="c-box__header__text">Details</h6>
                 <router-link
                  class="o-btn o-btn--primary o-btn--sm o-btn--rounded-sm u-d-if u-ai-center u-minw-auto"
                  v-if="userIsProgramManager()"
                  :to="{
                    name: 'EditFinding',
                    params: {
                      programUuid: finding.program.uuid,
                      findingUuid: finding.uuid,
                    },
                  }"
                >
                  <i class="fal fa-pencil u-mr-10"></i>
                  <span>Edit</span>
                </router-link>
                <!-- <div v-if="userIsAppOwner()" class="u-flex-buttons">
                  <button
                    class="o-btn o-btn--xs o-btn--rounded-sm o-btn--shadow"
                    @click="updateFindingResolution(findingsFilterOptions[1])"
                    v-if="finding.resolution === 3 || finding.resolution === 2"
                  >
                    Re-open
                  </button>
                </div> -->
              </div>
              <!-- .c-box__header -->
              <div class="c-box__body">
                <!-- Markdown Content -->
                <section class="c-markdown-content">
                  <vue-markdown v-if="finding.details" :source="finding.details" />
                </section>

                <!-- Vulnerability Tags -->
                <section class="u-mt-20" v-show="finding.vulnerability_types > 0">
                  <h6 class="u-fs-12 u-d-f u-ai-center u-mb-15">
                    <span>Vulnerability</span>
                  </h6>
                  <ul class="c-badge-list">
                    <li class="c-badge--vuln" v-for="type in finding.vulnerability_types" :key="type.uuid">
                      <span>{{ type.name }}</span>
                    </li>
                  </ul>
                </section>
              </div>
              <!-- .c-box__body -->
            </div>
            <!-- .c-box -->

            <!-- Attachments -->
            <div data-html2canvas-ignore class="c-box u-mt-20" v-show="showAttachments">
              <div class="c-box__header">
                <div class="c-box__header__text">Attachments</div>
              </div>
              <div class="c-box__body u-p-0">
                <ca-file-upload-attachments :attachments="finding.attachments" :allow-deleting="false" />
              </div>
            </div>

          </div>
          <div>
            <div class="c-box u-mb-20">
              <div class="c-box__header">
                <h6 class="c-box__header__text">Details</h6>
              </div>
              <!-- .c-box__header -->
              <div class="c-box__body">
                <ul>
                  <li class="c-dictionary c-dictionary--font-sm l-flex u-ai-center">
                    <div class="c-dictionary__key u-d-if u-ai-center">
                      <span>Created</span>
                    </div>
                    <div class="c-dictionary__value">
                      {{ finding.date_published | date }}
                    </div>
                  </li>
                  <li class="c-dictionary c-dictionary--font-sm l-flex u-ai-center">
                    <div class="c-dictionary__key u-d-if u-ai-center">
                      <span>Status</span>
                    </div>
                    <div class="c-dictionary__value">
                      <div v-if="userIsProgramManager()" class="c-dictionary__value">
                        <FindingStatusDropdown
                          :selectedStatus="resolutionName"
                          :hideAllStatuses="true"
                          @set-status-query="updateFindingResolution"
                        />
                      </div>
                      <div v-else class="c-dictionary__value">
                        <ResolutionBadge :resolution="resolutionName" />
                      </div>
                    </div>
                  </li>
                  <li class="c-dictionary c-dictionary--font-sm l-flex u-ai-center">
                    <div class="c-dictionary__key u-d-if u-ai-center">
                      <span>Severity</span>
                    </div>
                    <div class="c-dictionary__value">
                      <div v-if="userIsProgramManager()" class="c-dictionary__value">
                        <FindingSeverityDropdown
                          :selectedSeverity="finding.priority"
                          :hideAllSeverities="true"
                          @set-priority-query="updateFindingSeverity"
                        />
                      </div>
                      <div v-else class="c-dictionary__value">
                        <span class="c-badge" :class="`c-badge--severity-${severityClass}`">
                          {{ finding.priority === 'Informational' ? 'Info' : finding.priority }}
                        </span>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
            <!-- .c-box -->
            <div data-html2canvas-ignore class="c-box u-mb-20" v-if="userIsProgramManager() || userIsAppOwner()">
              <div class="c-box__header">
                <div class="c-box__header__text">Links</div>
              </div>
              <!-- .c-box__header -->
              <div class="c-box__body">
                <ul>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                    v-for="(relatedFinding, index) in finding.related_findings"
                    :key="`related-finding-${index}`"
                  >
                    <span>Finding</span>
                    <router-link
                      class="u-text-underline"
                      :to="{
                        name: 'Finding',
                        params: { uuid: relatedFinding.uuid },
                      }"
                      >{{ relatedFinding.title }}</router-link
                    >
                  </li>
                  <li
                    class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                    v-if="userIsProgramManager() && finding.submission"
                  >
                    <span>Submission</span>
                    <router-link
                      class="u-text-underline"
                      :to="{
                        name: 'Submission',
                        params: { uuid: finding.submission.uuid },
                      }"
                      >{{ finding.submission.title }}</router-link
                    >
                  </li>
                  <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5" v-if="finding.jira_link">
                    <span>Jira</span>
                    <a class="u-text-underline" :href="finding.jira_link.url">{{ finding.jira_link.title }}</a>
                  </li>
                  <!-- client jira url -->
                  <li
                    class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                    v-if="finding.client_jira_url"
                  >
                    <span>Jira</span>
                    <a class="u-text-underline" :href="finding.client_jira_url">{{ finding.client_jira_url }}</a>
                  </li>
                </ul>
              </div>
              <!-- .c-box__body -->
            </div>
            <!-- .c-box -->

            <div data-html2canvas-ignore class="c-box">
              <div class="c-box__header">
                <div class="c-box__header__text">Comments</div>
              </div>
              <div class="c-box__body">
                <chat-window :thread-uuid="finding.thread_uuid" />
              </div>
            </div>
            <!-- <finding-sidebar v-if="finding" :sidebar-style="findingInfoSidebarStyle" /> -->
          </div>
        </div>
      </div>
      <!-- .l-wrap -->
    </section>
  </main>
</template>

<script>
import DateTimeFilters from '@/filters/date-time-filters'
import { AccountMixin } from '@/mixins/account'
// import FindingSidebar from '@/modules/findings/_components/finding-sidebar/FindingSidebar'
import CaFileUploadAttachments from '@/modules/core/_components/ca-file-upload/CaFileUploadAttachments'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { FindingMixin } from '@/modules/findings/_mixins/finding'
import { ProgramsMixin } from '@/mixins/programs'
import PublishFindingBar from '@/modules/findings/_components/publish-finding-bar/PublishFindingBar'
import PublishFindingPanel from '@/modules/findings/_components/publish-finding-panel/PublishFindingPanel'
import FindingTopBar from '@/modules/findings/_components/finding-top-bar/FindingTopBar'
import VueMarkdown from 'vue-markdown'
import { clickOutside } from '@/directives/click-outside'
// import FindingSearchResults from '@/modules/findings/_components/finding-search/FindingSearchResults'
import FindingStatusDropdown from '@/modules/findings/_components/FindingStatusDropdown'
import FindingSeverityDropdown from '@/modules/findings/_components/FindingSeverityDropdown'
import { FINDINGS_FILTER_OPTIONS } from '@/modules/findings/_models/findings-filter-options'
import ChatWindow from '@/modules/chat/_components/ChatWindow'
import { getFindingResolutionById } from '@/modules/findings/_models/findings-resolution-options'
import ResolutionBadge from '@/modules/findings/_components/findings-list/ResolutionBadge'

import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default {
  name: 'Finding',
  components: {
    CaFileUploadAttachments,
    VueMarkdown,
    ChatWindow,
    // FindingSidebar,
    PublishFindingBar,
    FindingTopBar,
    PublishFindingPanel,
    // FindingSearchResults,
    FindingStatusDropdown,
    FindingSeverityDropdown,
    ResolutionBadge,
  },
  directives: {
    clickOutside,
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin, BreadcrumbsMixin, FindingMixin, ProgramsMixin],
  data() {
    return {
      selectedFindingUuid: '',
      completeFindingPanelVisible: false,
      program: {},
      attachments: [],
      boxHeight: null,
      loading: false,
      now: new Date(),
      publishFindingPanelVisible: false,
      showSeverityMenu: false,
      selectedResolution: -1,
      searchTerms: '',
      searchResults: [],
      showFindingSearchBar: false,
      showFindingSearchResults: false,
      findingsFilterOptions: Object.values(FINDINGS_FILTER_OPTIONS),
    }
  },
  computed: {
    severityClass() {
      if (!this.finding || !this.finding.priority) {
        return 'none'
      }
      const severity = this.finding.priority
      return severity.replace(/\s+/g, '-').toLowerCase()
    },
    statusClass() {
      const status = this.resolutionName || 'closed'
      return status.replace(/\s+/g, '-').toLowerCase()
    },
    showAttachments() {
      return this.finding && this.finding.attachments && this.finding.attachments.length > 0
    },
    showClearIcon() {
      return this.searchTerms && this.searchTerms.length > 0
    },
    resolutionName() {
      if (!this.finding || !this.finding.resolution) {
        return 'New'
      }
      return this.findingResolutionsMap[this.finding.resolution]
    },
    programTitle() {
      return !this.finding || !this.finding.program ? '' : this.finding.program.title
    },
    programUuid() {
      return !this.finding ? '' : this.finding.uuid
    },
    boxStyle() {
      return {
        height: `${this.boxHeight}px`,
      }
    },
    researcherProfileImage() {
      if (!this.finding || !this.finding.researcher) {
        return DEFAULT_USER_IMAGE
      }

      return this.finding.researcher.profile_picture || DEFAULT_USER_IMAGE
    },
    researcherUsername() {
      if (!this.finding || !this.finding.researcher) {
        return ''
      }
      return this.finding.researcher.username
    },
    researcherUuid() {
      if (!this.finding || !this.finding.researcher) {
        return ''
      }
      return this.finding.researcher.uuid
    },
    findingInfoSidebarStyle() {
      if (!this.showProgramNavbar) {
        return {}
      }

      const sidebar = this.$refs.findingInfoSidebar
      if (!sidebar) {
        return {}
      }

      return { height: 'calc(100vh - 160px)' }
    },
    resolutionText() {
      const resolution = getFindingResolutionById(this.finding.resolution)
      return resolution.name
    },
  },
  methods: {
    onFindingLinkCancel() {
      this.searchTerms = ''
      this.selectedFindingUuid = ''
    },
    findingSearchInputClick() {
      if (this.searchTerms && this.searchResults && this.searchResults.length > 0) {
        this.showFindingSearchResults = true
      }
    },
    clickOutsideSearchResults() {
      this.showFindingSearchResults = false
    },
    async toggleFindingLink(findingUuid, findingLinkUuid) {
      const payload = {
        findingUuid: this.finding.uuid,
        linkFindingUuid: findingLinkUuid,
      }
      await this.actionLinkFinding(payload)
    },
    async onSearchSubmit(val) {
      this.searchTerms = val
      const response = await this.actionSearchFindings({
        programUuid: this.finding.program.uuid,
        title: this.searchTerms,
      })
      this.searchResults = response.data.results
      this.showFindingSearchResults = true
    },
    setSelectedFindingUuid(val) {
      this.selectedFindingUuid = val
    },
    clearSearch() {
      this.searchTerms = ''
      this.selectedFindingUuid = ''
    },
    findingLinked() {
      this.searchTerms = ''
      this.selectedFindingUuid = ''
    },
    toggleFindingSearchBar() {
      this.showFindingSearchBar = !this.showFindingSearchBar
    },
    setResolution(resolution) {
      this.selectedResolution = resolution
    },
    clickOutsideSeverityMenu() {
      this.showSeverityMenu = false
    },
    async updateFindingResolution(resolution) {
      try {
        // check if returning number or resolution name
        if (isNaN(resolution)) {
          // convert string of resolution into corresponding int for backend to process
          let resolutionMap = this.findingResolutionsMap
          resolution = Object.keys(resolutionMap).find((key) => resolutionMap[key] === resolution)
        }
        this.$solar.show()
        const payload = {
          uuid: this.finding.uuid,
          resolution: resolution,
        }
        await this.actionEditFinding(payload)
        this.$caAlert.success('Finding resolution updated.')
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to update finding resolution.'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
      }
    },
    async updateFindingSeverity(severity) {
      try {
        // check if returning number or severity name
        if (isNaN(severity)) {
          // convert string of severity into corresponding int for backend to process
          let severityMap = this.findingPrioritiesMap
          severity = Object.keys(severityMap).find((key) => severityMap[key] === severity)
        }
        this.$solar.show()
        this.loading = true
        const payload = {
          uuid: this.finding.uuid,
          priority: severity,
        }
        await this.actionEditFinding(payload)
        this.selectedResolution = this.finding.resolution
        this.completeFindingPanelVisible = false
        this.$caAlert.success('Finding severity updated.')
        this.$solar.hide()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to update finding severity'
        this.$caAlert.error(error)
        this.completeFindingPanelVisible = false
      } finally {
        this.$solar.hide()
        this.loading = false
      }
    },
    toggleSeverityMenu() {
      this.showSeverityMenu = !this.showSeverityMenu
    },
    async completeFinding(resolution) {
      try {
        this.$solar.show()
        this.loading = true
        const payload = {
          uuid: this.finding.uuid,
          resolution: resolution,
        }
        await this.actionEditFinding(payload)
        this.selectedResolution = this.finding.resolution
        this.completeFindingPanelVisible = false
        this.$caAlert.success('Finding completed successfully.')
        this.$solar.hide()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to complete finding'
        this.$caAlert.error(error)
        this.completeFindingPanelVisible = false
      } finally {
        this.$solar.hide()
        this.loading = false
      }
    },
    clickOutsideFindingPanel(e) {
      this.completeFindingPanelVisible = false
    },
    closeCompleteFindingPanel(e) {
      this.selectedResolution = this.finding.resolution
      this.completeFindingPanelVisible = false
    },
    onWindowResize() {
      if (!this.$refs.boxHeader) {
        return
      }

      const boxHeaderHeight = this.$refs.boxHeader.offsetHeight
      const detailsHeaderHeight = this.$refs.submissionDetailsHeader.offsetHeight + 20
      const sectionPadding = 40
      const programNavbarHeight = this.showProgramNavbar === true ? 120 : 60
      const heightToMinus = boxHeaderHeight + detailsHeaderHeight + sectionPadding + programNavbarHeight
      const height = window.innerHeight - heightToMinus

      this.boxHeight = height
    },
    async loadProgram() {
      const response = await this.getProgram(this.finding.program.uuid)
      this.program = response.data
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
    onPublishFindingPanelCancel() {
      this.publishFindingPanelVisible = false
    },
    async showPublishFindingPanel(submissionUuid) {
      this.publishFindingPanelVisible = true
    },
    toggleFindingLinking() {
      this.actionToggleLinkingFinding()
    },
    openMetaResolutionPanel(e) {
      this.showSeverityMenu = false
      const target = e && e.target ? e.target : null
      if (!target) {
        return
      }
      const targetId = target.id ? 'report-meta-resolution' : ''
      if (targetId && targetId === 'report-meta-resolution') {
        this.completeFindingPanelVisible = !this.completeFindingPanelVisible
        return
      }

      const parentId = e.target.parentNode && e.target.parentNode.id ? e.target.parentNode.id : ''
      if (parentId === 'report-meta-resolution') {
        this.completeFindingPanelVisible = !this.completeFindingPanelVisible
      }
    },
    downloadPDF() {
      let canvasHeight = document.querySelector('*[data-html2canvas-add]').offsetHeight + 200
      html2canvas(this.$refs.content, { useCORS: true, allowTaint: true, scrollY: 0, height: canvasHeight }).then(
        (canvas) => {
          const image = { type: 'jpeg', quality: 0.98 }
          const margin = [0.5, 0.5]
          const filename = `${timestamp()} Inspectiv - ${this.finding.title}.pdf`

          var imgWidth = 8.5
          var pageHeight = 11

          var innerPageWidth = imgWidth - margin[0] * 2
          var innerPageHeight = pageHeight - margin[1] * 2

          // Calculate the number of pages.
          var pxFullHeight = canvas.height
          var pxPageHeight = Math.floor(canvas.width * (pageHeight / imgWidth))
          var nPages = Math.ceil(pxFullHeight / pxPageHeight)

          // Define pageHeight separately so it can be trimmed on the final page.
          pageHeight = innerPageHeight

          // Create a one-page canvas to split up the full image.
          var pageCanvas = document.createElement('canvas')
          var pageCtx = pageCanvas.getContext('2d')
          pageCanvas.width = canvas.width
          pageCanvas.height = pxPageHeight

          // Initialize the PDF.
          // eslint-disable-next-line
          var pdf = new jsPDF('p', 'in', [8.5, 11])

          for (var page = 0; page < nPages; page++) {
            // Trim the final page to reduce file size.
            if (page === nPages - 1 && pxFullHeight % pxPageHeight !== 0) {
              pageCanvas.height = pxFullHeight % pxPageHeight
              pageHeight = (pageCanvas.height * innerPageWidth) / pageCanvas.width
            }

            // Display the page.
            var w = pageCanvas.width
            var h = pageCanvas.height
            pageCtx.fillStyle = 'white'
            pageCtx.fillRect(0, 0, w, h)
            pageCtx.drawImage(canvas, 0, page * pxPageHeight, w, h, 0, 0, w, h)

            // Add the page to the PDF.
            if (page > 0) pdf.addPage()
            var imgData = pageCanvas.toDataURL('image/' + image.type, image.quality)
            pdf.addImage(imgData, image.type, margin[1], margin[0], innerPageWidth, pageHeight)
          }

          pdf.save(filename)
        }
      )
      function timestamp() {
        let d = new Date()
        let month = '' + (d.getMonth() + 1)
        let day = '' + d.getDate()
        let year = d.getFullYear()

        if (month.length < 2) month = '0' + month
        if (day.length < 2) day = '0' + day

        return [year, month, day].join('-')
      }
    },
  },
  async mounted() {
    this.$solar.show()
    try {
      await this.actionLoadFinding(this.$route.params.uuid)
      this.selectedResolution = this.finding.resolution
      document.title = `Inspectiv | ${this.finding.title}`
      await this.loadProgram()

      this.actionSetBreadcrumbs({
        parent: {
          route: this.$router.resolve({ name: 'Findings' }).route,
        },
        child: {
          title: this.finding.title,
          route: this.$route,
          copyValue: this.finding.uuid,
        },
      })
    } catch (e) {
      this.$caAlert.error('Finding not found')
    } finally {
      this.$solar.hide()
    }

    this.onWindowResize()
    window.addEventListener('resize', this.onWindowResize)
  },
  async destroyed() {
    await this.actionResetStore()
  },
}
</script>
