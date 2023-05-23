<template>
  <div>
    <!-- FINDINGS LIST OPTIONS -->
    <div>
      <findings-list-options
        :company-name="companyName"
        :showProgramSelector="true"
        :selectedProgramFromState="selectedProgramFromState"
        v-on="$listeners"
        @on-loading-progams="onLoadingPrograms"
        :programsLoading="programsLoading"
      />

      <div v-if="findingsListLoading && programsLoading" class="u-mb-20">
        <Spinner size="medium" />
      </div>

      <!-- FINDINGS TABLE -->
      <div v-else class="l-findings-search-wrapper l-wrap">
        <h2 class="u-fs-22 u-mb-24">Vulnerabilities</h2>
        <div class="l-flex l-findings-search">
          <div class="l-flex u-flex-wrap">
            <div class="u-mr-12">
              <SearchFindingByName v-on="$listeners" :inputText="inputText" />
            </div>
            <div class="u-mr-12" v-if="!this.isKanban">
              <FindingStatusDropdown v-on="$listeners" :selectedStatus="selectedStatus" />
            </div>
            <div class="u-mr-12">
              <FindingSeverityDropdown v-on="$listeners" :selectedSeverity="selectedSeverity" />
            </div>
            <div v-if="!this.isKanban" class="l-flex">
              <div>
                <DatePickerFilter :startDate="startDate" :endDate="endDate" v-on="$listeners" />
              </div>
              <div>
                <div v-if="!generatingReport">
                  <button
                    type="button"
                    class="o-btn o-btn--primary-light o-btn--rounded o-btn--sm u-d-if u-ai-center"
                    @click="generateCSV"
                    :disabled="generatingReport"
                  >
                    <i class="fal fa-file-download o-btn--icon-sm"></i>
                    <span>Export to CSV</span>
                  </button>
                </div>
                <div v-else class="u-mr-50">
                  <Spinner size="medium" />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="u-mb-20 l-flex u-ai-end u-jc-sb">
          <h6 class="o-text u-fs-16 o-text--gray o-text--400">Total Vulnerabilities ({{ currentQueryCount }})</h6>
          <div class="c-kanban-toggle">
            <div
              v-if="!isUserProgramManager"
              @click="toggleViewMode('kanban')"
              :class="{ 'c-kanban-toggle--active': isKanban }"
            >
              <i class="fal fa-columns"></i>
            </div>
            <div
              @click="!isUserProgramManager ? toggleViewMode('kanban') : null"
              :class="{ 'c-kanban-toggle--active': !isKanban }"
            >
              <i class="fal fa-th-list"></i>
            </div>
          </div>
        </div>

        <!-- list view -->
        <!-- <div  v-else>  -->
        <div class="c-datatable">
          <table class="c-datatable__table c-datatable--findings">
            <thead class="c-datatable__head">
              <tr>
                <th class="c-datatable__cell c-datatable__cell--title">Vulnerability</th>
                <th class="c-datatable__cell c-datatable__cell--program">
                  <span
                    class="c-datatable__sort-icon"
                    :class="sortOption.name === 'Program' ? 'sort-icon-selected' : ''"
                    @click="onSortChange('Program')"
                    >Program</span
                  >
                </th>
                <th class="c-datatable__cell c-datatable__cell--status">
                  <span
                    class="c-datatable__sort-icon"
                    :class="sortOption.name === 'Status' ? 'sort-icon-selected' : ''"
                    @click="onSortChange('Status')"
                    >Status</span
                  >
                </th>
                <th class="c-datatable__cell c-datatable__cell--created">
                  <span
                    class="c-datatable__sort-icon"
                    :class="sortOption.name === 'Date Published' ? 'sort-icon-selected' : ''"
                    @click="onSortChange('DatePublished')"
                    >Created</span
                  >
                </th>
              </tr>
            </thead>
            <tbody class="c-datatable__body">
              <tr
                class="c-datatable__row"
                v-for="finding in findings"
                :key="finding.uuid"
              >
                <router-link
                  tag="td"
                  class="c-datatable__cell c-datatable__cell--title o-text--500"
                  :to="{ name: 'Finding', params: { uuid: finding.uuid } }"
                >
                  <div class="l-flex u-ai-center">
                    <span
                      class="c-kanban__card-severity u-mr-10"
                      :class="`c-badge c-badge--severity-${finding.priority.toLowerCase()}`"
                    >
                      {{ finding.priority === 'Informational' ? 'Info' : finding.priority }}
                    </span>
                    <span class="u-mr-10">{{ finding.title }}</span>
                  </div>
                  <ul class="c-badge-list">
                    <li class="c-badge--vuln-type" v-for="vuln in finding.vulnerability_types" :key="vuln.uuid">
                      <span class="u-fs-11">{{ vuln.name }}</span>
                    </li>
                  </ul>
                </router-link>
                <router-link
                  tag="td"
                  class="c-datatable__cell c-datatable__cell--program o-text--500"
                  :to="{ name: 'Program', params: { uuid: finding.program_uuid } }"
                >
                  <div class="c-datatable__cell--thumb">
                    <img :src="finding.program_image ? finding.program_image : '/static/images/avatar-endpoint.svg'" />
                  </div>
                  <span>
                    {{ finding.program_title }}
                  </span>
                </router-link>
                <td class="c-datatable__cell">
                  <ResolutionBadge :resolution="finding.resolution" />
                </td>
                <td class="c-datatable__cell">
                  {{ finding.date_published | date }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <CPagination :current-page="currentPage" :page-count="pageCount" @on-page-change="onPageChange" />
        <!-- </div> -->
      </div>
    </div>
  </div>
</template>

<script>
import ReportingService from '@/services/api/reporting-service'
import { clickOutside } from '@/directives/click-outside'
import { AccountMixin } from '@/mixins/account'
import DateTimeFilters from '@/filters/date-time-filters'
import FindingsListOptions from '@/modules/findings/_components/findings-list-options/FindingsListOptions'
import SearchFindingByName from '@/modules/findings/_components/findings-list/SearchFindingByName'
import DatePickerFilter from '@/modules/findings/_components/DatePickerFilter'
import { DatesMixin } from '@/mixins/dates'
import Spinner from 'vue-simple-spinner'
import FindingSeverityDropdown from '@/modules/findings/_components/FindingSeverityDropdown'
import FindingStatusDropdown from '@/modules/findings/_components/FindingStatusDropdown'
import CPagination from '@/modules/core/_components/c-pagination/CPagination'
import ResolutionBadge from '@/modules/findings/_components/findings-list/ResolutionBadge'

import {
  SET_FINDINGS_QUERY_VULN as FINDINGS_SET_QUERY_VULN,
  STORE_KEY as FINDINGS_STORE,
} from '@/stores/findings/types'

export default {
  name: 'FindingsList',
  directives: {
    clickOutside,
  },
  filters: DateTimeFilters,
  mixins: [AccountMixin, DatesMixin],
  components: {
    FindingsListOptions,
    SearchFindingByName,
    DatePickerFilter,
    FindingSeverityDropdown,
    FindingStatusDropdown,
    Spinner,
    CPagination,
    ResolutionBadge,
  },
  props: {
    findings: {
      type: Array,
      required: true,
      default: () => [],
    },
    currentPage: {
      type: Number,
      default: 1,
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
    inputText: {
      required: true,
      type: String,
    },
    selectedSeverity: {
      required: true,
      type: String,
    },
    currentQueryCount: {
      type: Number,
      required: true,
    },
    isKanban: {
      required: true,
      type: Boolean,
    },
    selectedStatus: {
      required: true,
      type: String,
    },
    selectedProgramFromState: {
      required: true,
      type: String,
    },
    isUserProgramManager: {
      required: false,
      type: Boolean,
    },
    findingsListLoading: {
      required: true,
      type: Boolean,
    },
  },
  data() {
    return {
      now: new Date(),
      sortDropdownExpanded: false,
      form: {
        startDate: '',
        endDate: '',
        filter: {},
      },
      generatingReport: false,
      programsLoading: false,
    }
  },
  computed: {
    sortOrderIconClass() {
      return this.sortOrder === 'asc' ? 'fa-chevron-up' : 'fa-chevron-down'
    },
  },
  methods: {
    async loadReportTemplates() {
      let templates = []
      let page = 1
      let query = { page: page }

      const programUuid = this.form.programUuid
      if (programUuid) {
        query['programUuid'] = programUuid
      }

      while (page >= 1) {
        try {
          query['page'] = page
          const response = await ReportingService.getReportTemplateList(query)
          const data = response.data
          page++
          templates = [...templates, ...data.results]

          if (!data.next) {
            break
          }
        } catch (e) {
          break
        }
      }

      this.reportTemplates = templates
    },
    async generateCSV() {
      this.$emit('generate-csv')
    },
    async generateReport() {
      this.generatingReport = true
      try {
        const startDate = new Date(this.startDate)
        const endDate = new Date(this.endDate)
        let postData = {
          start_date: startDate,
          end_date: endDate,
          template_uuid: 'XGsKnFbghtKGRWGdni3CuM',
        }
        if (this.programUuid) {
          postData['program_uuid'] = this.programUuid
        }
        if (this.companyName) {
          postData['company_name'] = this.companyName
        }
        const response = await ReportingService.generateReport(postData)
        ReportingService.downloadReport(response.data)
        this.$caAlert.success('Report generated')
      } catch (e) {
        throw e
      } finally {
        this.generatingReport = false
      }
    },
    toggleSortDropdown() {
      this.sortDropdownExpanded = !this.sortDropdownExpanded
    },
    hideSortDropdown() {
      this.sortDropdownExpanded = false
    },
    onFilterChange(option) {
      this.$emit('filter-changed', option)
    },
    onPageChange(page) {
      if (page > this.pageCount || page < 1) {
        return
      }
      this.$emit('page-changed', page)
    },
    onSortChange(option) {
      const sortOption = this.sortOptions[option]
      this.$emit('sort-changed', sortOption)
    },
    findingClick(finding, e) {
      const targetId = e && e.target && e.target.id ? e.target.id : ''
      if (targetId && targetId.includes('link')) {
        return
      }
      this.$router.push({ path: `/findings/${finding.uuid}` })
    },
    addVulnerabilityType(vulnerability) {
      this.$store.dispatch(`${FINDINGS_STORE}/${FINDINGS_SET_QUERY_VULN}`, vulnerability)
    },
    toggleViewMode(mode) {
      this.$emit('toggle-view-mode', mode)
    },
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
    onLoadingPrograms(status) {
      this.programsLoading = status
    },
  },
}
</script>
<style scoped></style>
