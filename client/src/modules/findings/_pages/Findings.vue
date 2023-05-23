<template>
  <main class="c-site-main">
    <div class="u-pb-20">
      <div v-if="!this.isKanban">
        <findings-list
          :current-page="findingsQuery.page"
          :filter-option="filterOption"
          :filter-options="filterOptions"
          :page-count="findingsQuery.total_pages"
          :sortOption="sortOption"
          :sortOptions="sortOptions"
          :sortOrder="sortOrder"
          :start-date="startDate"
          :end-date="endDate"
          :inputText="findingNameSearch"
          :selectedSeverity="findingsQuery.priority"
          :isKanban="isKanban"
          :findings="findings"
          :selectedStatus="findingsQuery.status"
          :currentQueryCount="findingsQuery.count"
          :selectedProgramFromState="findingsQuery.programs"
          :isUserProgramManager="this.userIsProgramManager()"
          :findingsListLoading="listLoading"
          @on-start-date-selected="onStartDateSelected"
          @on-end-date-selected="onEndDateSelected"
          @apply-search-text="onApplySearchText"
          @clear-search-text="clearSearchText"
          @page-changed="onPageChange"
          @sort-changed="onSortChange"
          @set-priority-query="setPriorityQuery"
          @set-status-query="setStatusQuery"
          @on-add-remove-program="addRemoveProgram"
          @toggle-view-mode="toggleViewMode"
          @generate-csv="generateCSV"
          @on-select-program="onSelectProgram"
        />
      </div>
      <div v-if="this.isKanban && !this.userIsProgramManager()">
        <FindingsKanban
          :isKanban="isKanban"
          :kanbanLoading="kanbanLoading"
          :selectedProgramFromState="findingsQuery.programs"
          @toggle-view-mode="toggleViewMode"
          @update-finding-resolution="updateFindingResolution"
          @on-select-program="onSelectProgram"
        />
      </div>
    </div>
  </main>
</template>

<script>
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import FindingsList from '@/modules/findings/_components/findings-list/FindingsList'
import { FindingsMixin } from '@/modules/findings/_mixins/findings'
import { DatesMixin } from '@/mixins/dates'
import FindingsKanban from '@/modules/findings/_components/findings-kanban/FindingsKanban'
import { date, getFormattedTime } from '@/filters/date-time-filters'
import { AccountMixin } from '@/mixins/account'

export default {
  name: 'Findings',
  components: {
    FindingsList,
    FindingsKanban,
  },
  mixins: [BreadcrumbsMixin, FindingsMixin, DatesMixin, AccountMixin],
  data() {
    return {
      loading: false,
      kanbanLoading: true,
      listLoading: true,
    }
  },
  methods: {
    async onPageChange(page) {
      await this.actionSetPage(page)
    },
    async onSortChange(option) {
      await this.actionSetSortOption(option)
    },
    async onApplySearchText(value) {
      await this.actionSetFindingQueryFindingName(value)
    },
    async clearSearchText() {
      await this.actionSetFindingQueryFindingName('')
    },
    async loadFindings() {
      this.$solar.show()
      try {
        // await this.actionLoadFindings()
        await this.actionLoadKanbanFindings()
        this.kanbanLoading = false
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to load findings'
        this.$caAlert.error(error)
      } finally {
        this.kanbanLoading = false
        this.$solar.hide()
      }
    },
    // on kanban column move, update resolution
    async updateFindingResolution(finding) {
      this.actionUpdateFindingResolution(finding)
    },
    setPriorityQuery(priority) {
      this.actionSetPriorityQuery(priority)
    },
    setStatusQuery(status) {
      this.actionSetStatusQuery(status)
    },
    addRemoveProgram(uuid) {
      this.actionSetProgramQuery(uuid)
    },
    onStartDateSelected(date) {
      const isoDate = this.getIsoDateStringFromDate(new Date(date))
      this.actionSetStartDate(isoDate)
    },
    onEndDateSelected(date) {
      const isoDate = this.getIsoDateStringFromDate(new Date(date))
      this.actionSetEndDate(isoDate)
    },
    toggleViewMode(mode) {
      this.actionToggleKanban(mode)
    },
    async generateCSV() {
      let currentPage = 1
      let csv = 'Created,Status,Endpoint,Title,Type,Severity\n'
      while (currentPage <= this.findingsQuery.total_pages) {
        const { results } = await this.actionGenerateCSVRequest(currentPage)
        for (let row of results) {
          const {
            date_published: datePublished,
            resolution,
            program_title: programTitle,
            title,
            vulnerability_types: vulnerabilityTypes,
            priority,
          } = row

          const vulnerabilityTypesFormated = vulnerabilityTypes.length ? vulnerabilityTypes[0].name : ''

          const formattedValues = [
            date(datePublished),
            resolution,
            programTitle,
            title,
            vulnerabilityTypesFormated,
            priority,
          ].map(value => '"' + value.replace(/"/g, '""') + '"')

          const csvRow = formattedValues.join(',')
          csv += csvRow + '\n'
        }
        currentPage += 1
      }
      const anchor = document.createElement('a')
      anchor.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
      anchor.target = '_blank'
      anchor.download = `${getFormattedTime()}_FindingsReport.csv`
      anchor.click()
    },
    async onSelectProgram(programUuid) {
      try {
        this.listLoading = true
        await this.actionSetProgramQuery(programUuid)
      } catch (error) {
      } finally {
        this.listLoading = false
      }
    },
  },
  async mounted() {
    if (!this.userIsProgramManager()) {
      await this.loadFindings()
    }

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Findings' }).route,
      },
    })
  },
  async created() {
    if (this.userIsProgramManager()) {
      this.actionSetKanban(false)
    }
  },
}
</script>
