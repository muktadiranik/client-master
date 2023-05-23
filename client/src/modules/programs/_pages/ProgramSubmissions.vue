<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20" v-if="!programLoading">
      <SubmissionList
        :sort-option="sortOption"
        :sort-order="sortOrder"
        :filter-option="filterOption"
        :current-page="query.page"
        :page-count="query.total_pages"
        :submission-count="query.count"
        :submissions="submissions"
        :from-program-submissions="true"
        @filter-changed="onFilterChange"
        @sort-changed="onSortChange"
        @page-changed="onPageChange"
      />
    </div>
  </main>
</template>

<script>
import SubmissionList from '@/modules/submissions/_components/submission-list/components/SubmissionList'
import { mapActions } from 'vuex'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { NavbarMixin } from '@/mixins/navbar'
import { ProgramsMixin } from '@/mixins/programs'
import { ProgramSubmissionsMixin } from '@/modules/programs/_mixins/program-submissions'

import {
  STORE_KEY as SUBMISSIONS_STORE_KEY,
  LOAD_SUBMISSION_RESOLUTIONS,
  LOAD_SUBMISSION_STATUSES,
  LOAD_SUBMISSION_PRIORITIES,
} from '@/stores/submissions/types'
import submissionStore from '@/stores/submissions'

export default {
  name: 'ProgramSubmissions',
  components: {
    SubmissionList,
  },
  mixins: [BreadcrumbsMixin, NavbarMixin, ProgramSubmissionsMixin, ProgramsMixin],
  data() {
    return {
      loading: false,
      programLoading: false,
    }
  },
  methods: {
    ...mapActions(SUBMISSIONS_STORE_KEY, {
      loadSubmissionStatuses: LOAD_SUBMISSION_STATUSES,
      loadSubmissionPriorities: LOAD_SUBMISSION_PRIORITIES,
      loadSubmissionResolutions: LOAD_SUBMISSION_RESOLUTIONS,
    }),
    async onFilterChange(option) {
      await this.actionSetFilterOption(option)
    },
    async onPageChange(page) {
      await this.actionSetQueryPage(page)
    },
    async onSortChange(option) {
      await this.actionSetSortOption(option)
    },
    resetQuery() {
      this.submissions = []
      this.query = {
        currentUrl: '',
        currentPage: 0,
        nextPageUrl: '',
        previousPageUrl: '',
        count: 0,
      }
    },
    async loadSubmissions() {
      this.$solar.show()
      try {
        await this.actionLoadSubmissions()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to load submissions'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
      }
    },
    async loadProgram() {
      this.programLoading = true

      const response = await this.getProgram(this.$route.params.uuid)
      await this.actionSetProgram(response.data)
      document.title = `Inspectiv | ${this.program.title}`

      this.programLoading = false
    },
    async onScrollEvent() {
      if (this.loading) {
        return
      }

      this.loading = true

      const pageHeight = window.innerHeight + window.pageYOffset
      const scrollHeight = document.body.scrollHeight - 100
      const bottomOfWindow = pageHeight >= scrollHeight
      if (bottomOfWindow) {
        if (this.query.next) {
          await this.loadSubmissions()
          window.scrollBy(0, -100)
        }
      }

      this.loading = false
    },
  },
  async mounted() {
    if (!(SUBMISSIONS_STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(SUBMISSIONS_STORE_KEY, submissionStore)
    }

    await this.loadSubmissionStatuses()
    await this.loadSubmissionPriorities()
    await this.loadSubmissionResolutions()
    await this.loadProgram()
    await this.actionLoadProgramForNavbar(this.program)
    document.title = `Inspectiv | ${this.program.title}`
    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Programs' }).route,
      },
      child: {
        title: this.program.title,
        route: this.$route,
        copyValue: this.program.uuid,
      },
    })
    if (!this.submissions || this.submissions.length === 0) {
      await this.loadSubmissions()
    }
  },
}
</script>
