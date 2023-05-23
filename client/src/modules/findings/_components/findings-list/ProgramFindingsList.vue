<template>
  <div>
    <!-- FINDINGS LIST OPTIONS -->
    <findings-list-options
      :filter-option="filterOption"
      :start-date="startDate"
      :end-date="endDate"
      :company-name="companyName"
      :showProgramSelector="false"
      :programUuid="programUuid"
      @on-filter-option-change="onFilterChange"
      v-on="$listeners"
    />

    <!-- FINDINGS TABLE -->
    <div class="l-findings-search-wrapper l-wrap">
      <div class="l-flex l-findings-search u-jc-sb">
        <div class="l-flex u-flex-wrap">
          <div class="u-mr-12">
            <SearchFindingByName v-on="$listeners" :inputText="inputText" />
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
            <!-- <VulnerabilityTypeEditor
              @on-add-vulnerability-type="addVulnerabilityType"
              :input-placeholder="'Filter by vulnerability type...'"
            /> -->
          </div>
        </div>
        <div>
          <!-- <DatePickerFilter :start-date="startDate" :end-date="endDate" v-on="$listeners" /> -->
        </div>
      </div>
      <div class="u-mb-20">
        <h6 class="o-text u-fs-16 o-text--lg u-color-gray-900">Total vulnerabilities (76)</h6>
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
                <p>Closed ({{ remediatedFindings.length }})</p>
              </div>
              <draggable
                id="remediated"
                :forceFallback="true"
                v-model="remediatedFindings"
                :animation="200"
                ghost-class="ghost-card"
                group="findings"
                @change="onChange('remediated', $event)"
                class="draggable-area"
              >
                <FindingListItem
                  :finding="finding"
                  v-for="(finding, index) in remediatedFindings"
                  :key="`remediated-finding-${index}`"
                />
              </draggable>
            </div>

            <!-- <div class="l-findings-kanban-col"></div>
            <div class="l-findings-kanban-col"></div> -->
          </div>
        </div>
      </div>
    </div>
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
import Multiselect from 'vue-multiselect'
// import DatePickerFilter from '@/modules/findings/_components/DatePickerFilter'
// import VulnerabilityTypeEditor from '@/modules/vulnerability-types/components/VulnerabilityTypeEditor'
import {
  SET_FINDINGS_QUERY_VULN as PROGRAM_FINDINGS_SET_QUERY_VULN,
  STORE_KEY as PROGRAM_FINDINGS_STORE,
  UPDATE_NEW_FINDINGS,
  UPDATE_ACCEPTED_FINDINGS,
  UPDATE_IN_PROGRESS_FINDINGS,
  UPDATE_REMEDIATED_FINDINGS,
} from '@/stores/program-findings/types'

export default {
  name: 'ProgramFindingsList',
  directives: {
    clickOutside,
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin],
  components: {
    FindingListItem,
    FindingsListOptions,
    // VulnerabilityTypeEditor,
    SearchFindingByName,
    draggable,
    // DatePickerFilter,
    Multiselect,
  },
  props: {
    count: {
      type: Number,
      default: 0,
      required: true,
    },
    currentPage: {
      type: Number,
      default: 1,
      required: true,
    },
    filterOption: {
      type: Object,
      default: () => {},
      required: true,
    },
    filterOptions: {
      type: Object,
      default: () => {},
      required: true,
    },
    endDate: {
      type: String,
      default: '',
      required: true,
    },
    startDate: {
      type: String,
      default: '',
      required: true,
    },
    pageCount: {
      type: Number,
      default: 1,
      required: true,
    },
    sortOrder: {
      type: String,
      required: true,
    },
    sortOption: {
      type: Object,
      default: () => {},
      required: true,
    },
    sortOptions: {
      type: Object,
      default: () => {},
      required: true,
    },
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
    inputText: {
      required: true,
      type: String,
    },
    selectedPriority: {
      required: true,
      type: String,
    },
  },
  data() {
    return {
      now: new Date(),
      sortDropdownExpanded: false,
      severityOptions: [
        { title: 'Critical', selected: false },
        { title: 'High', selected: false },
        { title: 'Medium', selected: false },
        { title: 'Low', selected: false },
        { title: 'Info', selected: false },
      ],
      selectedSeverities: [],
    }
  },
  computed: {
    sortOrderIconClass() {
      return this.sortOrder === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down'
    },
    newCount() {
      const newFindings = this.findings.filter((x) => x.resolution === 1)
      return newFindings ? newFindings.length : 0
    },
    vulnLength() {
      return this.$store.state.$common.vulnerabilityTypes.length
    },
    newFindings: {
      get() {
        return this.$store.state.$programFindings.newFindings
      },
      set(value) {
        this.$store.commit(`${PROGRAM_FINDINGS_STORE}/${UPDATE_NEW_FINDINGS}`, value)
      },
    },
    inProgressFindings: {
      get() {
        return this.$store.state.$programFindings.inProgressFindings
      },
      set(value) {
        this.$store.commit(`${PROGRAM_FINDINGS_STORE}/${UPDATE_IN_PROGRESS_FINDINGS}`, value)
      },
    },
    acceptedFindings: {
      get() {
        return this.$store.state.$programFindings.acceptedFindings
      },
      set(value) {
        this.$store.commit(`${PROGRAM_FINDINGS_STORE}/${UPDATE_ACCEPTED_FINDINGS}`, value)
      },
    },
    remediatedFindings: {
      get() {
        return this.$store.state.$programFindings.remediatedFindings
      },
      set(value) {
        this.$store.commit(`${PROGRAM_FINDINGS_STORE}/${UPDATE_REMEDIATED_FINDINGS}`, value)
      },
    },
  },
  methods: {
    toggleSortDropdown() {
      this.sortDropdownExpanded = !this.sortDropdownExpanded
    },
    hideSortDropdown() {
      this.sortDropdownExpanded = false
    },
    onFilterChange(option) {
      this.$emit('filter-changed', option)
    },
    onHeaderClick(name) {
      const sortOption = this.sortOptions[name]
      this.$emit('sort-changed', sortOption)
    },
    onPageChange(page) {
      if (page > this.pageCount || page < 1) {
        return
      }
      this.$emit('page-changed', page)
    },
    onSortChange(option) {
      this.$emit('sort-changed', option)
    },
    findingClick(finding, e) {
      const targetId = e && e.target && e.target.id ? e.target.id : ''
      if (targetId && targetId.includes('link')) {
        return
      }
      this.$router.push({ path: `/findings/${finding.uuid}` })
    },
    headerClick(name) {
      const sortOption = this.sortOptions[name]
      this.$emit('sort-changed', sortOption)
    },
    onChange(col, event) {
      if (!event.added) return
      const { uuid } = event.added.element
      let updatedResoltion
      switch (col) {
        case 'new':
          updatedResoltion = 1
          break
        case 'in-progress':
          updatedResoltion = 4
          break
        case 'accepted':
          updatedResoltion = 3
          break
        case 'remediated':
          updatedResoltion = 2
          break
        default:
          break
      }
      this.$emit('update-finding-resolution', { uuid, resolution: updatedResoltion })
    },
    addVulnerabilityType(vulnerability) {
      this.$store.dispatch(`${PROGRAM_FINDINGS_STORE}/${PROGRAM_FINDINGS_SET_QUERY_VULN}`, vulnerability)
    },
    select(option) {
      option.selected = !option.selected
      this.$emit('set-priority-query', option.title)
    },
    removeSeverity(severity) {
      severity.selected = false
    }
  },
}
</script>
<style scoped>
</style>
