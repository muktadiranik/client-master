<template>
  <div>
    <!-- <findings-list-options :showProgramSelector="true" v-on="$listeners" /> -->
    <div class="l-findings-search u-mt-20">
      <div class="l-flex u-flex-wrap u-ai-center">
        <div class="u-mr-12">
          <SearchFindingByName v-on="$listeners" :inputText="inputText" />
        </div>
        <div class="u-mr-12">
          <SubmissionSeverityDropdown v-on="$listeners" :selectedSeverity="selectedSeverity" />
        </div>
        <!-- <div class="u-mr-15">
          <PaymentDropdown v-on="$listeners" :selectedPaymentStatus="selectedPaymentStatus" />
        </div> -->
        <div>
          <div>
            <input
              id="showValid"
              type="checkbox"
              class="o-custom-checkbox"
              v-model="validOnly"
              @click="toggleValidQuery"
            />
            <label for="showValid" class="o-text--dark">Show accepted only</label>
          </div>
        </div>
      </div>
    </div>
    <div class="u-mb-20 l-flex u-ai-end u-jc-sb">
      <h6 class="o-text u-fs-16 o-text--gray o-text--400">Total Submissions ({{ submissionCount }})</h6>
      <div class="c-kanban-toggle">
        <div @click="toggleViewMode('kanban')" :class="{ 'c-kanban-toggle--active': isSubmissionKanban }">
          <i class="fal fa-columns"></i>
        </div>
        <div @click="toggleViewMode('list')" :class="{ 'c-kanban-toggle--active': !isSubmissionKanban }">
          <i class="fal fa-th-list"></i>
        </div>
      </div>
    </div>

    <div class="u-pb-40">
      <div class="c-datatable c-datatable--submissions">
        <table class="c-datatable__table">
          <thead class="c-datatable__head">
            <tr>
              <th class="c-datatable__cell c-datatable__cell--title">Submission</th>
              <th class="c-datatable__cell c-datatable__cell--program">
                <span
                  class="c-datatable__sort-icon"
                  :class="sortOption.name === 'Program' ? 'sort-icon-selected' : ''"
                  @click="onSortChange('Program')"
                  >Program</span>
              </th>
              <th class="c-datatable__cell c-datatable__cell--status">
                <span
                  class="c-datatable__sort-icon"
                  :class="sortOption.name === 'Status' ? 'sort-icon-selected' : ''"
                  @click="onSortChange('Status')"
                  >Status</span>
              </th>
              <th class="c-datatable__cell c-datatable__cell--bounty">
                <span
                  class="c-datatable__sort-icon"
                  :class="sortOption.name === 'Bounty' ? 'sort-icon-selected' : ''"
                  @click="onSortChange('Bounty')"
                  >Bounty</span>
              </th>
              <th class="c-datatable__cell c-datatable__cell--created">
                <span
                  class="c-datatable__sort-icon"
                  :class="sortOption.name === 'Date Created' ? 'sort-icon-selected' : ''"
                  @click="onSortChange('DateCreated')"
                  >Created</span>
              </th>
            </tr>
          </thead>
          <tbody class="c-datatable__body">
            <tr
              class="c-datatable__row"
              v-for="submission in submissions"
              :key="submission.uuid"
            >
              <router-link
                tag="td"
                class="c-datatable__cell c-datatable__cell--title o-text--500"
                :to="{ name: 'Submission', params: { uuid: submission.uuid } }"
                >
                <div class="l-flex u-ai-center">
                  <span
                    class="c-kanban__card-severity u-mr-10"
                    :class="`c-badge c-badge--severity-${submission.priority_display.toLowerCase()}`"
                  >
                    {{ submission.priority_display === 'Informational' ? 'Info' : submission.priority_display }}
                  </span>
                  <span class="u-mr-10">{{ submission.title }}</span>
                </div>
                <ul class="c-badge-list">
                  <li class="c-badge--vuln-type" v-for="vuln in submission.vulnerability_types" :key="vuln.uuid">
                    <span class="u-fs-11">{{ vuln.name }}</span>
                  </li>
                </ul>
              </router-link>
              <router-link
                tag="td"
                class="c-datatable__cell c-datatable__cell--program o-text--500"
               :to="{ name: 'Program', params: { uuid: submission.program.uuid } }"
              >
                <div class="c-datatable__cell--thumb">
                  <img
                    :src="submission.program.image ? submission.program.image : '/static/images/avatar-endpoint.svg'"
                  />
                </div>
                <span>
                  {{ submission.program.title }}
                </span>
              </router-link>
              <td class="c-datatable__cell c-datatable__cell--status" v-if="displayStatus(submission.status_display)==='Closed'">
                <ResolutionBadge :resolution="submission.resolution_display || ''" />
              </td>  
              <td class="c-datatable__cell c-datatable__cell--status u-text-uppercase o-text--500" v-else>
                <ResolutionBadge :resolution="displayStatus(submission.status_display) || ''" />
              </td>
              <td class="c-datatable__cell c-datatable__cell--bounty o-text--dark o-text--500">
                {{ submission.payout_display }}
              </td>
              <td class="c-datatable__cell c-datatable__cell--created">
                {{ submission.date_created | date }}
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      <CPagination :current-page="currentPage" :page-count="pageCount" @on-page-change="onPageChange" />
    </div>
  </div>
</template>

<script>
import { SUBMISSION_FILTER_OPTIONS } from '@/modules/submissions/_components/submission-list/models/submission-filter-options'
import { clickOutside } from '@/directives/click-outside'
import { DatesMixin } from '@/mixins/dates'
import DateTimeFilters from '@/filters/date-time-filters'
import SearchFindingByName from '@/modules/findings/_components/findings-list/SearchFindingByName'
import SubmissionSeverityDropdown from '@/modules/submissions/_components/submission-list/components/SubmissionSeverityDropdown'
import CPagination from '@/modules/core/_components/c-pagination/CPagination'
import ResolutionBadge from '@/modules/findings/_components/findings-list/ResolutionBadge'
// import PaymentDropdown from '@/modules/submissions/_components/PaymentDropdown.vue'

export default {
  name: 'SubmissionList',
  components: {
    SearchFindingByName,
    SubmissionSeverityDropdown,
    CPagination,
    // PaymentDropdown,
    ResolutionBadge,
  },
  filters: DateTimeFilters,
  mixins: [DatesMixin],
  directives: {
    clickOutside,
  },
  data() {
    return {
      filterOptions: SUBMISSION_FILTER_OPTIONS,
      expanded: false,
    }
  },
  props: {
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
    pageCount: {
      type: Number,
      default: 1,
      required: true,
    },
    submissionCount: {
      type: Number,
      default: 0,
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
    fromProgramSubmissions: {
      type: Boolean,
      default: false,
      required: false,
    },
    submissions: {
      type: Array,
      default: () => {},
      required: true,
    },
    isSubmissionKanban: {
      type: Boolean,
      required: true,
    },
    selectedSeverity: {
      type: String,
      required: true,
    },
    inputText: {
      required: true,
      type: String,
    },
    selectedPaymentStatus: {
      required: true,
      type: String,
    },
    validOnly: {
      required: true,
      type: Boolean,
    },
  },
  computed: {
    filterOptionVal: {
      get() {
        return this.filterOption
      },
      set(val) {
        this.$emit('filter-changed', val)
      },
    },
  },
  methods: {
    onPageChange(page) {
      if (page > this.pageCount || page < 1) {
        return
      }
      this.$emit('page-changed', page)
    },
    onFilterChange(option) {
      this.$emit('filter-changed', option)
    },
    onSortChange(option) {
      const sortOption = this.sortOptions[option]
      this.$emit('sort-changed', sortOption)
    },
    onHeaderClick(name) {
      const sortOption = this.sortOptions.find((x) => x.name === name)
      this.$emit('sort-changed', sortOption)
    },
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
    toggleViewMode() {
      this.$emit('toggle-view-mode')
    },
    toggleValidQuery() {
      this.$emit('set-valid-query')
    },
    displayStatus(originalStatus) {
      return originalStatus.toLowerCase() === 'validating' || originalStatus.toLowerCase() === 'in review'
        ? 'In Progress'
        : originalStatus
    },
  },
}
</script>

<style></style>
