<template>
  <div>
    <!-- FINDINGS TABLE -->
    <div class="l-findings-search-wrapper l-wrap">
      <div class="l-flex l-findings-search u-jc-sb">
        <div class="l-flex u-flex-wrap">
          <div class="u-mr-12">
            <SearchFindingByName 
              v-on="$listeners"
              :inputText="inputText"
              @apply-search-text="updateTitleSearch"
            />
          </div>
          <div class="u-mr-12">
            <div class="l-findings-severity-filter">
              <div class="c-multiselect">
                <multiselect
                  v-model="selectedSeverities"
                  class="c-multiselect"
                  placeholder="Severity"
                  :options="severityOptions"
                  label="title"
                  track-by="title"
                  multiple
                  :taggable="false"
                  :closeOnSelect="false"
                  :showLabels="false"
                  :searchable="false"
                >
                  <span
                    slot="option"
                    slot-scope="scope"
                    class="checkbox-label"
                    @click="select(scope.option)"
                    :key="scope.option.title"
                  >
                    <div>
                      <input type="checkbox" class="o-custom-checkbox" v-model="scope.option.selected" @focus.prevent />
                      <label></label>
                    </div>
                    <span class="c-badge" :class="`c-badge--severity-${scope.option.title.toLowerCase()}`">
                      {{ scope.option.title }}
                    </span>
                  </span>
                  <span class="arrow" slot="caret" slot-scope="{ toggle }" @mousedown.prevent.stop="toggle"> </span>
                </multiselect>
                <div class="c-multiselect__custom-tags">
                  <div
                    class="c-multiselect__custom-tag"
                    v-for="severity in selectedSeverities"
                    v-show="severity.selected"
                    :key="severity.title"
                  >
                    <span class="c-badge" :class="`c-badge--severity-${severity.title.toLowerCase()}`">
                      {{ severity.title }}
                    </span>
                    <span @click="removeSeverity(severity)">
                      <i class="fal fa-times-circle"></i>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div></div>
      </div>
      <div class="u-mb-20">
        <h6 class="o-text u-fs-16 o-text--lg u-color-gray-900">Total vulnerabilities ({{ newFindings.length + inProgressFindings.length + closedFindings.length }})</h6>
      </div>
      <div class="c-kanban c-kanban--findings">
        <div class="l-flex u-jc-center">
          <div class="l-flex u-jc-sb c-kanban-cols">
            <!-- New Findings -->
            <div class="c-kanban-col">
              <div class="c-kanban-col-title">
                <p>NEW ({{ newFindings.length }})</p>
              </div>
              <draggable
                id="new"
                :forceFallback="true"
                :animation="200"
                ghost-class="ghost-card"
                group="findings"
                v-model="newFindings"
                @change="onChange('new', $event)"
                class="draggable-area"
              >
                <FindingListItem
                  :finding="finding"
                  v-for="(finding, index) in newFindings"
                  :key="`new-finding-${index}`"
                />
              </draggable>
            </div>

            <!-- In Progress Findings -->
            <div class="c-kanban-col">
              <div class="c-kanban-col-title">
                <p>IN PROGRESS ({{ inProgressFindings.length }})</p>
              </div>
              <draggable
                id="in-progress"
                :forceFallback="true"
                v-model="inProgressFindings"
                :animation="200"
                ghost-class="ghost-card"
                group="findings"
                @change="onChange('in-progress', $event)"
                class="draggable-area"
              >
                <FindingListItem
                  :finding="finding"
                  v-for="(finding, index) in inProgressFindings"
                  :key="`inprogress-finding-${index}`"
                />
              </draggable>
            </div>

            <!-- Closed Findings -->
            <div class="c-kanban-col">
              <div class="c-kanban-col-title">
                <p>Closed ({{ closedFindings.length }})</p>
              </div>
              <draggable
                id="remediated"
                :forceFallback="true"
                v-model="closedFindings"
                :animation="200"
                ghost-class="ghost-card"
                group="findings"
                @change="onChange('closed', $event)"
                class="draggable-area"
              >
                <FindingListItem
                  :finding="finding"
                  v-for="(finding, index) in closedFindings"
                  :key="`closed-finding-${index}`"
                />
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </div>
    <FindingsKanbanModal
      :visible="showModal"
      @on-complete-submission="updateCloseResolution"
      @cancel-click="cancelCloseResolution"
    />
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import { clickOutside } from '@/directives/click-outside'
import { AccountMixin } from '@/mixins/account'
import DateTimeFilters from '@/filters/date-time-filters'
import FindingListItem from '@/modules/findings/_components/findings-list/FindingListItem'
// import KanbanFindingItem from '@/modules/findings/_components/findings-kanban/KanbanFindingItem'
import FindingsKanbanModal from '@/modules/findings/_components/findings-kanban/FindingsKanbanModal'
import SearchFindingByName from '@/modules/findings/_components/findings-list/SearchFindingByName'
import Multiselect from 'vue-multiselect'
import {
  STORE_KEY as PROGRAM_FINDINGS_STORE,
  UPDATE_NEW_FINDINGS,
  UPDATE_IN_PROGRESS_FINDINGS,
  UPDATE_CLOSED_FINDINGS,
  ADD_NEW_FINDING,
  ADD_IN_PROGRESS_FINDING,
  REMOVE_CLOSED_FINDING,
} from '@/stores/program-findings/types'
export default {
  name: 'ProgramFindingsKanban',
  directives: {
    clickOutside,
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin],
  components: {
    draggable,
    Multiselect,
    FindingListItem,
    FindingsKanbanModal,
    SearchFindingByName,
  },
  props: {
    companyName: {
      type: String,
      default: '',
      required: false,
    },
    programUuid: {
      type: String,
      default: '',
      required: false,
    },
  },
  data() {
    return {
      severityOptions: [
        { title: 'Critical', selected: false },
        { title: 'High', selected: false },
        { title: 'Medium', selected: false },
        { title: 'Low', selected: false },
        { title: 'Info', selected: false },
        { title: 'None', selected: false },
      ],
      selectedSeverities: [],
      inputText: '',
      showModal: false,
      modalFinding: '',
    }
  },
  computed: {
    newFindings: {
      get() {
        return this.handleFilters(this.$store.state.$programFindings.newFindings)
      },
      set(value) {
        this.$store.commit(`${PROGRAM_FINDINGS_STORE}/${UPDATE_NEW_FINDINGS}`, value)
      },
    },
    inProgressFindings: {
      get() {
        return this.handleFilters(this.$store.state.$programFindings.inProgressFindings)
      },
      set(value) {
        this.$store.commit(`${PROGRAM_FINDINGS_STORE}/${UPDATE_IN_PROGRESS_FINDINGS}`, value)
      },
    },
    closedFindings: {
      get() {
        return this.handleFilters(this.$store.state.$programFindings.closedFindings)
      },
      set(value) {
        this.$store.commit(`${PROGRAM_FINDINGS_STORE}/${UPDATE_CLOSED_FINDINGS}`, value)
      },
    },
  },
  methods: {
    handleFilters(toFilter) {
      let filteredArray = toFilter
      if (this.selectedSeverities.length > 0) {
        let currSeveritiesArray = []
        this.selectedSeverities.forEach((x) => currSeveritiesArray.push(x.title))
        filteredArray = filteredArray.filter((x) =>
          x.priority === 'Informational'
            ? currSeveritiesArray.includes('Info')
            : currSeveritiesArray.includes(x.priority)
        )
      }
      if (this.inputText) {
        filteredArray = filteredArray.filter((x) => x.title.toLowerCase().includes(this.inputText.toLowerCase()))
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
        case 'in-progress':
          updatedResolution = 4
          break
        case 'closed':
          this.showModal = true
          this.modalFinding = event.added.element
          return
        default:
          break
      }
      this.$emit('update-finding-resolution', { uuid, resolution: updatedResolution })
      this.updateCardResolution(event.added.element, updatedResolution)
    },
    select(option) {
      option.selected = !option.selected
    },
    removeSeverity(severity) {
      severity.selected = false
    },
    updateSearchTerm(val) {
      this.inputText = val
    },
    updateCloseResolution(resolution) {
      this.$emit('update-finding-resolution', { uuid: this.modalFinding.uuid, resolution: resolution })
      this.updateCardResolution(this.modalFinding, resolution)
      this.resetModal()
    },
    cancelCloseResolution() {
      if (this.modalFinding.resolution.toLowerCase() === 'in progress') {
        this.$store.commit(`${PROGRAM_FINDINGS_STORE}/${ADD_IN_PROGRESS_FINDING}`, this.modalFinding)
      } else if (this.modalFinding.resolution.toLowerCase() === 'new') {
        this.$store.commit(`${PROGRAM_FINDINGS_STORE}/${ADD_NEW_FINDING}`, this.modalFinding)
      }
      this.$store.commit(`${PROGRAM_FINDINGS_STORE}/${REMOVE_CLOSED_FINDING}`, this.modalFinding)
      this.resetModal()
    },
    resetModal() {
      this.showModal = false
      this.modalFinding = ''
    },
    updateCardResolution(finding, resolution) {
      switch (resolution) {
        case 1:
          finding.resolution = 'New'
          break
        case 2:
          finding.resolution = 'Remediated'
          break
        case 3:
          finding.resolution = 'Accepted'
          break
        case 4:
          finding.resolution = 'In Progress'
          break
      }
    },
    updateTitleSearch(value) {
      this.inputText = value
    }
  },
}
</script>
<style scoped>
</style>
