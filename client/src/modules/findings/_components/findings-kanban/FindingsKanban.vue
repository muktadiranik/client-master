<template>
  <div>
    <!-- FINDINGS LIST OPTIONS -->
    <findings-list-options
      :showProgramSelector="true"
      :selectedProgramFromState="selectedProgramFromState"
      @on-select-program="setProgramFilter"
      v-on="$listeners"
    />

    <!-- FINDINGS TABLE -->

    <div v-if="kanbanLoading" class="u-mb-20">
      <Spinner size="medium" />
    </div>

    <div v-else>
      <div class="l-findings-search-wrapper l-wrap">
        <h2 class="u-fs-22 u-mb-24">Vulnerabilities</h2>
        <div class="l-flex l-findings-search">
          <div class="l-flex u-flex-wrap">
            <div class="u-mr-12">
              <SearchFindingByName v-on="$listeners" :inputText="inputText" @apply-search-text="updateTitleSearch" @clear-search-text="clearTitleSearch"/>
            </div>
            <div class="u-mr-12">
              <FindingSeverityDropdown @set-priority-query="setSeverityFilter" :selectedSeverity="selectedSeverity" />
            </div>
            <button
              type="button"
              class="o-btn o-btn--primary-light o-btn--rounded o-btn--sm"
              @click="showReportModal"
            >
              <i class="fal fa-file-download o-btn--icon-sm"></i>
              <span>Generate Report</span>
            </button>
          </div>
        </div>
        <div class="u-mb-20 l-flex u-ai-end u-jc-sb">
          <h6 class="o-text u-fs-16 o-text--gray o-text--400">
            Total Vulnerabilities ({{
              kanbanNewFindings.length + kanbanInProgressFindings.length + kanbanClosedFindings.length
            }})
          </h6>
          <div class="c-kanban-toggle">
            <div @click="toggleViewMode" :class="{ 'c-kanban-toggle--active': isKanban }">
              <i class="fal fa-columns"></i>
            </div>
            <div @click="toggleViewMode" :class="{ 'c-kanban-toggle--active': !isKanban }">
              <i class="fal fa-th-list"></i>
            </div>
          </div>
        </div>
        <!-- kanban view -->
        <div class="c-kanban c-kanban--findings">
          <div class="l-flex u-jc-center">
            <div class="l-flex u-jc-sb c-kanban-cols">
              <!-- New Findings -->
              <div class="c-kanban-col">
                <div class="c-kanban-col-title">
                  <p>NEW ({{ kanbanNewFindings.length }})</p>
                </div>
                <draggable
                  id="new"
                  class="draggable-area"
                  :forceFallback="true"
                  :animation="200"
                  ghost-class="ghost-card"
                  group="findings"
                  v-model="kanbanNewFindings"
                  @change="onChange('new', $event)"
                  @start="dragging = true"
                  @end="completeDrag"
                >
                  <div class="c-kanban-col-empty" v-if="kanbanNewFindings.length === 0">
                    <i class="fal fa-binoculars"></i>
                    <p>Vulnerabilities will appear here as they are discovered</p>
                  </div>
                  <FindingListItem
                    v-else
                    :finding="finding"
                    v-for="(finding, index) in kanbanNewFindings"
                    :key="`new-finding-${index}`"
                    :dragging="dragging"
                  />
                </draggable>
              </div>

              <!-- In Progress Findings -->
              <div class="c-kanban-col">
                <div class="c-kanban-col-title">
                  <p>IN PROGRESS ({{ kanbanInProgressFindings.length }})</p>
                </div>
                <draggable
                  id="in-progress"
                  class="draggable-area"
                  :forceFallback="true"
                  v-model="kanbanInProgressFindings"
                  :animation="200"
                  ghost-class="ghost-card"
                  group="findings"
                  @change="onChange('in-progress', $event)"
                  @start="dragging = true"
                  @end="completeDrag"
                >
                  <div class="c-kanban-col-empty" v-if="kanbanInProgressFindings.length === 0">
                    <i class="fal fa-hourglass-half"></i>
                    <p>Move the vulnerabilities here as you start working on them to keep track of progress</p>
                  </div>
                  <FindingListItem
                    v-else
                    :finding="finding"
                    v-for="(finding, index) in kanbanInProgressFindings"
                    :key="`inprogress-finding-${index}`"
                    :dragging="dragging"
                  />
                </draggable>
              </div>

              <!-- Closed Findings -->
              <div class="c-kanban-col">
                <div class="c-kanban-col-title">
                  <p>CLOSED ({{ kanbanClosedFindings.length }})</p>
                  <div class="c-kanban-info">
                    <i class="fal fa-info-circle"></i>
                    <div>
                      <div class="c-kanban-info-cue">
                        You are only seeing the last 30 days of closed vulnerabilities, if you would like to see them
                        all, go to the
                        <span class="o-text--500">list view</span>
                      </div>
                    </div>
                  </div>
                </div>
                <draggable
                  id="closed"
                  class="draggable-area"
                  :forceFallback="true"
                  v-model="kanbanClosedFindings"
                  :animation="200"
                  ghost-class="ghost-card"
                  group="findings"
                  @change="onChange('closed', $event)"
                  @start="dragging = true"
                  @end="completeDrag"
                >
                  <div class="c-kanban-col-empty" v-if="kanbanClosedFindings.length === 0">
                    <i class="fal fa-check"></i>
                    <p>Move the vulnerabilities here once you resolve them or to set them as Risk Accepted</p>
                  </div>
                  <FindingListItem
                    v-else
                    :finding="finding"
                    v-for="(finding, index) in kanbanClosedFindings"
                    :key="`closed-finding-${index}`"
                    :dragging="dragging"
                    
                  />
                </draggable>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FindingsKanbanModal
      :visible="modal.showModal"
      @on-complete-submission="updateResolution"
      @cancel-click="cancelMove"
    />
    <FindingsKanbanReportModal :visible="ReportModalVisible" @cancel-report-click="hideReportModal" />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { clickOutside } from '@/directives/click-outside'
import { AccountMixin } from '@/mixins/account'
import DateTimeFilters from '@/filters/date-time-filters'
import FindingListItem from '@/modules/findings/_components/findings-list/FindingListItem'
import FindingsListOptions from '@/modules/findings/_components/findings-list-options/FindingsListOptions'
import SearchFindingByName from '@/modules/findings/_components/findings-list/SearchFindingByName'
import { DatesMixin } from '@/mixins/dates'
import Spinner from 'vue-simple-spinner'
import FindingSeverityDropdown from '@/modules/findings/_components/FindingSeverityDropdown'
import FindingsKanbanModal from '@/modules/findings/_components/findings-kanban/FindingsKanbanModal'
import FindingsKanbanReportModal from '@/modules/findings/_components/findings-kanban/FindingsKanbanReportModal'

import {
  STORE_KEY as FINDINGS_STORE,
  UPDATE_NEW_FINDINGS,
  UPDATE_IN_PROGRESS_FINDINGS,
  UPDATE_CLOSED_FINDINGS,
  ADD_NEW_FINDING,
  ADD_IN_PROGRESS_FINDING,
  ADD_CLOSED_FINDING,
  REMOVE_CLOSED_FINDING,
  // REMOVE_NEW_FINDING,
} from '@/stores/findings/types'

export default {
  name: 'FindingsKanban',
  directives: {
    clickOutside,
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin, DatesMixin],
  components: {
    FindingListItem,
    FindingsListOptions,
    SearchFindingByName,
    draggable,
    FindingSeverityDropdown,
    Spinner,
    FindingsKanbanModal,
    FindingsKanbanReportModal,
  },
  props: {
    companyName: {
      type: String,
      default: '',
      required: false,
    },
    isKanban: {
      required: true,
      type: Boolean,
    },
    kanbanLoading: {
      required: true,
      type: Boolean,
    },
    selectedProgramFromState: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      selectedSeverity: '',
      inputText: '',
      modal: {
        showModal: false,
        modalType: '',
        finding: '',
      },
      selectedProgram: '',
      ReportModalVisible: false,
      dragging: false
    }
  },
  computed: {
    kanbanNewFindings: {
      get() {
        return this.handleFilters(this.$store.state.$findings.kanbanNewFindings)
      },
      set(value) {
        this.$store.commit(`${FINDINGS_STORE}/${UPDATE_NEW_FINDINGS}`, value)
      },
    },
    kanbanInProgressFindings: {
      get() {
        return this.handleFilters(this.$store.state.$findings.kanbanInProgressFindings)
      },
      set(value) {
        this.$store.commit(`${FINDINGS_STORE}/${UPDATE_IN_PROGRESS_FINDINGS}`, value)
      },
    },
    kanbanClosedFindings: {
      get() {
        return this.handleFilters(this.$store.state.$findings.kanbanClosedFindings)
      },
      set(value) {
        this.$store.commit(`${FINDINGS_STORE}/${UPDATE_CLOSED_FINDINGS}`, value)
      },
    },
  },
  methods: {
    handleFilters(toFilter) {
      let filteredArray = toFilter
      if (this.selectedSeverity) {
        filteredArray = filteredArray.filter((x) => x.priority.toLowerCase() === this.selectedSeverity.toLowerCase())
      }
      if (this.inputText) {
        filteredArray = filteredArray.filter((x) => x.title.toLowerCase().includes(this.inputText.toLowerCase()))
      }
      if (this.selectedProgram) {
        filteredArray = filteredArray.filter((x) => x.program_uuid === this.selectedProgram)
      }
      return filteredArray
    },
    findingClick(finding, e) {
      const targetId = e && e.target && e.target.id ? e.target.id : ''
      if (targetId && targetId.includes('link')) {
        return
      }
      this.$router.push({ path: `/findings/${finding.uuid}` })
    },
    onChange(col, event) {
      if (!event.added) return
      const { uuid } = event.added.element
      let updatedResolution
      switch (col) {
        case 'new':
          updatedResolution = 1
          break
        // code for new modal popup
        // this.modal.modalType = 'new'
        // this.modal.showModal = true
        // this.modal.finding = event.added.element
        // return
        case 'in-progress':
          updatedResolution = 4
          break
        case 'closed':
          this.modal.modalType = 'closed'
          this.modal.showModal = true
          this.modal.finding = event.added.element
          return
        default:
          break
      }
      this.$emit('update-finding-resolution', { uuid, resolution: updatedResolution })
      this.updateCardResolution(event.added.element, updatedResolution)
    },
    toggleViewMode() {
      this.$emit('toggle-view-mode')
    },
    updateResolution(resolution) {
      this.$emit('update-finding-resolution', { uuid: this.modal.finding.uuid, resolution: resolution })
      this.updateCardResolution(this.modal.finding, resolution)
      this.resetModal()
    },
    cancelMove() {
      this.$store.commit(`${FINDINGS_STORE}/${REMOVE_CLOSED_FINDING}`, this.modal.finding)

      if (this.modal.finding.resolution.toLowerCase() === 'in progress') {
        this.$store.commit(`${FINDINGS_STORE}/${ADD_IN_PROGRESS_FINDING}`, this.modal.finding)
      } else if (this.modal.finding.resolution.toLowerCase().includes('new')) {
        this.$store.commit(`${FINDINGS_STORE}/${ADD_NEW_FINDING}`, this.modal.finding)
      } else if (this.modal.finding.resolution.toLowerCase().includes('closed')) {
        this.$store.commit(`${FINDINGS_STORE}/${ADD_CLOSED_FINDING}`, this.modal.finding)
      }
      this.resetModal()
    },
    resetModal() {
      this.modal.showModal = false
      this.modal.finding = ''
      this.modal.modalType = ''
    },
    updateCardResolution(finding, resolution) {
      switch (resolution) {
        case 1:
          finding.resolution = 'New'
          break
        case 2:
          finding.resolution = 'Closed Remediated'
          break
        case 3:
          finding.resolution = 'Closed Risk Accepted'
          break
        case 4:
          finding.resolution = 'In Progress'
          break
        case 5:
          finding.resolution = 'New Rediscovered'
          break
        case 6:
          finding.resolution = 'Closed Verified'
          break
      }
    },
    updateTitleSearch(value) {
      this.inputText = value
    },
    clearTitleSearch() {
      this.inputText = ''
    },
    setSeverityFilter(severity) {
      this.selectedSeverity = severity
    },
    setProgramFilter(program) {
      this.selectedProgram = program
    },
    showReportModal() {
      this.ReportModalVisible = true
    },
    hideReportModal() {
      this.ReportModalVisible = false
    },
    completeDrag(){
      // delay to avoid unnecesary navigation on Firefox
      setTimeout(() => {
        this.dragging = false
      }, 500)
    }
  },
}
</script>
