<template>
  <main class="c-site-main">
    <div class="c-submissions">
      <div v-if="!userIsProgramManager()">
        <SubmissionsHeader />
      </div>
      <div class="l-wrap">
        <div v-if="(!isMobile && featuredPrograms.length >= 3) || (isMobile && featuredPrograms.length > 0)">
          <SubmissionsFeatured :programs="featuredPrograms" :followedPrograms="followedPrograms" />
        </div>
        <div v-if="!this.submissionKanban">
          <SubmissionList
            :sort-option="sortOption"
            :sortOptions="sortOptions"
            :sort-order="sortOrder"
            :filter-option="filterOption"
            :current-page="submissionsQuery.page"
            :page-count="submissionsQuery.total_pages"
            :submission-count="submissionsQuery.count"
            :isSubmissionKanban="submissionKanban"
            :submissions="testSubmissions"
            :selectedSeverity="submissionsQuery.priority"
            :inputText="submissionsQuery.submissionNameSearch"
            :selectedPaymentStatus="submissionsQuery.payment"
            :validOnly="submissionsQuery.validOnly"
            @filter-changed="onFilterChange"
            @sort-changed="onSortChange"
            @page-changed="onPageChange"
            @toggle-view-mode="toggleViewMode"
            @apply-search-text="onApplySearchText"
            @clear-search-text="clearSearchText"
            @set-priority-query="setPriorityQuery"
            @set-status-query="setStatusQuery"
            @set-payment-query="setPaymentQuery"
            @set-valid-query="setValidQuery"
          />
        </div>
        <div v-else>
          <SubmissionsKanban
            :isLoading="isLoading"
            :isSubmissionKanban="submissionKanban"
            @toggle-view-mode="toggleViewMode"
          />
        </div>
      </div>
    </div>
  </main>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex'
import {
  STORE_KEY,
  LOAD_SUBMISSIONS,
  LOAD_SUBMISSION_PRIORITIES,
  LOAD_SUBMISSION_RESOLUTIONS,
  LOAD_SUBMISSION_STATUSES,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_FILTER_OPTION,
  SET_SUBMISSIONS_QUERY_PAGE,
  RESET_QUERY,
  RESET_STORE,
  GET_KANBAN_STATUS,
  TOGGLE_KANBAN_STATUS,
  LOAD_KANBAN_SUBMISSIONS,
  GET_SUBMISSIONS,
  SET_PRIORITY_QUERY,
  SET_STATUS_QUERY,
  SET_SUBMISSIONS_QUERY_SUBMISSION_NAME,
  SET_SUBMISSIONS_QUERY_PAYMENT,
  SET_SUBMISSIONS_QUERY_VALID,
} from '@/stores/submissions/types'
import store from '@/stores/submissions'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { FollowedProgramsMixin } from '@/mixins/followed-programs'
import { AccountMixin } from '@/mixins/account'
import { SubmissionMixin } from '@/mixins/submission'

import SubmissionList from '@/modules/submissions/_components/submission-list/components/SubmissionList'
import SubmissionsHeader from '@/modules/submissions/_components/submission-list/components/SubmissionsHeader'
import SubmissionsFeatured from '@/modules/submissions/_components/submission-list/components/SubmissionsFeatured'

import SubmissionsKanban from '@/modules/submissions/_components/submissions-kanban/SubmissionsKanban'

// import SubmissionService from '@/services/api/submission-service'
import ProgramService from '@/services/api/program-service'

export default {
  name: 'Submissions',
  mixins: [AccountMixin, FollowedProgramsMixin, BreadcrumbsMixin, SubmissionMixin],
  components: {
    SubmissionList,
    SubmissionsHeader,
    SubmissionsFeatured,
    SubmissionsKanban,
  },
  data() {
    return {
      isMobile: false,
      isLoading: true,
      submissionsLoading: false,
      initialLoad: true,
      featuredPrograms: [],
    }
  },
  computed: {
    ...mapState(STORE_KEY, {
      submissions: state => state.submissions,
      filterOption: state => state.filterOption,
      sortOption: state => state.sortOption,
      sortOptions: state => state.sortOptions,
      sortOrder: state => state.sortOrder,
      submissionsQuery: state => state.submissionsQuery,
      kanbanNewSubmissions: state => state.kanbanNewSubmissions,
      kanbanInProgressSubmissions: state => state.kanbanInProgressSubmissions,
      kanbanClosedSubmissions: state => state.kanbanClosedSubmissions,
    }),
    ...mapGetters(STORE_KEY, {
      isSubmissionKanban: GET_KANBAN_STATUS,
      submissions: GET_SUBMISSIONS,
    }),
    submissionKanban() {
      return this.isSubmissionKanban
    },
    testSubmissions() {
      return this.submissions
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadSubmissionResolutions: LOAD_SUBMISSION_RESOLUTIONS,
      actionLoadSubmissionPriorities: LOAD_SUBMISSION_PRIORITIES,
      actionLoadSubmissionStatuses: LOAD_SUBMISSION_STATUSES,
      actionLoadSubmissions: LOAD_SUBMISSIONS,
      actionResetStore: RESET_STORE,
      actionResetQuery: RESET_QUERY,
      actionSetFilterOption: SET_FILTER_OPTION,
      actionSetSortOption: SET_SORT_OPTION,
      actionSetSortOrder: SET_SORT_ORDER,
      actionSetSubmissionsQueryPage: SET_SUBMISSIONS_QUERY_PAGE,
      actionToggleKanban: TOGGLE_KANBAN_STATUS,
      actionLoadKanbanSubmissions: LOAD_KANBAN_SUBMISSIONS,
      actionSetPriorityQuery: SET_PRIORITY_QUERY,
      actionSetStatusQuery: SET_STATUS_QUERY,
      actionSetSubmissionQuerySubmissionName: SET_SUBMISSIONS_QUERY_SUBMISSION_NAME,
      actionSetPaymentQuery: SET_SUBMISSIONS_QUERY_PAYMENT,
      actionSetValidQuery: SET_SUBMISSIONS_QUERY_VALID,
    }),
    async onPageChange(page) {
      await this.actionSetSubmissionsQueryPage(page)
    },
    async onFilterChange(option) {
      await this.actionSetFilterOption(option)
    },
    async onSortChange(option) {
      await this.actionSetSortOption(option)
    },
    async loadSubmissions() {
      this.$solar.show()
      if (this.initialLoad) {
        this.initialLoad = false
      } else {
        this.submissionsLoading = true
      }
      try {
        await this.actionLoadSubmissions()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to load submissions'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
        this.submissionsLoading = false
      }
    },
    isMobileCheck() {
      const mql = window.matchMedia('(max-width: 1023px)')
      this.isMobile = mql.matches
    },
    toggleViewMode(mode) {
      this.actionToggleKanban(mode)
    },
    async getAllFeaturedPrograms() {
      try {
        const res = await ProgramService.getAllProgramsList()
        this.featuredPrograms = res.data.filter(x => x.featured)
      } catch (error) {}
    },
    setPriorityQuery(priority) {
      this.actionSetPriorityQuery(priority)
    },
    setStatusQuery(status) {
      this.actionSetStatusQuery(status)
    },
    async onApplySearchText(value) {
      await this.actionSetSubmissionQuerySubmissionName(value)
    },
    async clearSearchText() {
      this.actionSetSubmissionQuerySubmissionName('')
    },
    setPaymentQuery(paymentStatus) {
      this.actionSetPaymentQuery(paymentStatus)
    },
    setValidQuery(isValid) {
      this.actionSetValidQuery(isValid)
    },
  },
  async created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
    await this.getAllFeaturedPrograms()
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }

    await this.actionLoadSubmissionStatuses()
    await this.actionLoadSubmissionPriorities()
    await this.actionLoadSubmissionResolutions()
    await this.actionLoadFollowedPrograms()
    await this.actionLoadSubmissions()
    // await this.loadSubmissions()
    // await this.getAllSubmissions()
    try {
      await this.actionLoadKanbanSubmissions()
    } catch (e) {
      return e
    } finally {
      this.isLoading = false
    }

    // if (!this.submissions || this.submissions.length === 0) {
    //   await this.loadSubmissions()
    // }
    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Submissions' }).route,
      },
      child: {},
    })

    window.addEventListener('resize', this.isMobileCheck)
    this.isMobileCheck()
  },
}
</script>
