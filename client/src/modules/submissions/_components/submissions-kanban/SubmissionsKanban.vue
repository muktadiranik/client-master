<template>
  <div>
    <div class="l-findings-search u-mt-20">
      <h2 class="u-fs-22 u-mb-24">Submissions</h2>
      <div class="l-flex u-flex-wrap">
        <div class="u-mr-12">
          <SearchFindingByName v-on="$listeners" :inputText="inputText" @apply-search-text="updateTitleSearch" @clear-search-text="clearTitleSearch" />
        </div>
        <div class="u-mr-12">
          <SubmissionSeverityDropdown
            v-on="$listeners"
            @set-priority-query="setSeverityFilter"
            :selectedSeverity="selectedSeverity"
          />
        </div>
      </div>
    </div>
    <div class="u-mb-20 l-flex u-ai-end u-jc-sb">
      <h6 class="o-text u-fs-16 o-text--gray o-text--400">
        Total Submissions ({{
          kanbanNewSubmissions.length + kanbanInProgressSubmissions.length + kanbanClosedSubmissions.length
        }})
      </h6>
      <div class="c-kanban-toggle">
        <div @click="toggleViewMode" :class="{ 'c-kanban-toggle--active': isSubmissionKanban }">
          <i class="fal fa-columns"></i>
        </div>
        <div @click="toggleViewMode" :class="{ 'c-kanban-toggle--active': !isSubmissionKanban }">
          <i class="fal fa-th-list"></i>
        </div>
      </div>
    </div>

    <div class="c-kanban c-kanban--submissions">
      <div class="l-flex u-jc-center">
        <div v-if="isLoading">
          <div class="u-mt-20" v-show="isLoading">
            <Spinner size="medium" />
          </div>
        </div>
        <div v-else>
          <div class="l-flex u-jc-sb c-kanban-cols">
            <!-- New Submissions -->
            <div v-if="kanbanNewSubmissions" class="c-kanban-col">
              <div class="c-kanban-col-title">
                <p>NEW ({{ kanbanNewSubmissions.length }})</p>
              </div>
              <draggable
                :disabled="true"
                :forceFallback="true"
                :animation="200"
                ghost-class="ghost-card"
                group="submission"
                class="draggable-area"
              >
                <SubmissionListItem
                  :submission="submission"
                  v-for="(submission, index) in kanbanNewSubmissions"
                  :key="`submission-${index}`"
                />
              </draggable>
            </div>

            <!-- In Progress Submissions -->
            <div v-if="kanbanInProgressSubmissions" class="c-kanban-col">
              <div class="c-kanban-col-title">
                <p>IN PROGRESS ({{ kanbanInProgressSubmissions.length }})</p>
              </div>
              <draggable
                :disabled="true"
                :forceFallback="true"
                :animation="200"
                ghost-class="ghost-card"
                group="submission"
                class="draggable-area"
              >
                <SubmissionListItem
                  :submission="submission"
                  v-for="(submission, index) in kanbanInProgressSubmissions"
                  :key="`submission-${index}`"
                />
              </draggable>
            </div>

            <!-- Closed Submissions -->
            <div v-if="kanbanClosedSubmissions" class="c-kanban-col">
              <div class="c-kanban-col-title">
                <p>CLOSED ({{ kanbanClosedSubmissions.length }})</p>
                <div class="c-kanban-info">
                  <i class="fal fa-info-circle"></i>
                  <div>
                    <div class="c-kanban-info-cue">
                      You are only seeing the last 30 days of closed submissions, if you would like to see them all, go
                      to the
                      <span class="o-text--500">list view</span>
                    </div>
                  </div>
                </div>
              </div>
              <draggable
                :disabled="true"
                :forceFallback="true"
                :animation="200"
                ghost-class="ghost-card"
                group="submission"
                class="draggable-area"
              >
                <SubmissionListItem
                  :submission="submission"
                  v-for="(submission, index) in kanbanClosedSubmissions"
                  :key="`submission-${index}`"
                />
              </draggable>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import draggable from 'vuedraggable'
import SubmissionListItem from '@/modules/submissions/_components/submission-list/components/SubmissionListItem'
import { clickOutside } from '@/directives/click-outside'
import { DatesMixin } from '@/mixins/dates'
import DateTimeFilters from '@/filters/date-time-filters'
import SearchFindingByName from '@/modules/findings/_components/findings-list/SearchFindingByName'
import SubmissionSeverityDropdown from '@/modules/submissions/_components/submission-list/components/SubmissionSeverityDropdown'

import Spinner from 'vue-simple-spinner'

export default {
  name: 'SubmissionsKaban',
  components: {
    SubmissionListItem,
    draggable,
    SearchFindingByName,
    SubmissionSeverityDropdown,
    Spinner,
  },
  filters: DateTimeFilters,
  mixins: [DatesMixin],
  directives: {
    clickOutside,
  },
  data() {
    return {
      expanded: false,
      inputText: '',
      selectedSeverity: '',
    }
  },
  props: {
    isSubmissionKanban: {
      type: Boolean,
      required: true,
    },
    isLoading: {
      type: Boolean,
      required: true,
      default: true,
    },
  },
  computed: {
    kanbanNewSubmissions() {
      return this.handleFilters(this.$store.state.$submissions.kanbanNewSubmissions)
    },
    kanbanInProgressSubmissions() {
      return this.handleFilters(this.$store.state.$submissions.kanbanInProgressSubmissions)
    },
    kanbanClosedSubmissions() {
      return this.handleFilters(this.$store.state.$submissions.kanbanClosedSubmissions)
    },
  },
  methods: {
    handleFilters(toFilter) {
      let filteredArray = toFilter
      if (this.selectedSeverity) {
        filteredArray = filteredArray.filter(
          x => x.priority_display.toLowerCase() === this.selectedSeverity.toLowerCase()
        )
      }
      if (this.inputText) {
        filteredArray = filteredArray.filter(x => x.title.toLowerCase().includes(this.inputText.toLowerCase()))
      }
      if (this.selectedProgram) {
        filteredArray = filteredArray.filter(x => x.program_uuid === this.selectedProgram)
      }
      return filteredArray
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
    toggleViewMode() {
      this.$emit('toggle-view-mode')
    },
  },
}
</script>

<style></style>
