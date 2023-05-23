<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <div class="l-dashboard-page">
          <div class="u-overflow-hidden-with-box-shadow">
            <div class="c-box">
              <div class="c-box__header">
                <h6 class="o-h6">Submissions Stats</h6>
              </div>
              <!-- /.c-box__header -->
              <div class="c-box__body" v-if="submissionStats">
                <div class="u-space-between u-ai-fs u-nm-20">
                  <div class="u-m-20" style="width: 156px; height: 156px; position: relative">
                    <canvas id="severity-chart"></canvas>
                  </div>
                  <div class="u-m-20">
                    <div class="u-d-f u-flex-wrap u-nm-20">
                      <div class="c-stat c-stat--lg u-m-20">
                        <div class="c-stat__icon-box">
                          <i class="fas fa-check-circle c-stat__icon u-color-success"></i>
                        </div>
                        <div class="c-stat__text">
                          <div class="c-stat__label">Accepted</div>
                          <div class="c-stat__number">{{ submissionStats.accepted }}</div>
                        </div>
                      </div>
                      <div class="c-stat c-stat--lg u-m-20">
                        <div class="c-stat__icon-box">
                          <i class="fas fa-file-export c-stat__icon u-color-primary"></i>
                        </div>
                        <div class="c-stat__text">
                          <div class="c-stat__label">Submitted</div>
                          <div class="c-stat__number">{{ submissionStats.submitted }}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <!-- /.c-box__body -->
              <div class="c-box__footer" v-if="submissionStats">
                <div class="u-d-f u-flex-wrap u-jc-sb u-nm-10">
                  <div class="c-stat c-stat--severity-critical u-m-10">
                    <div class="c-stat__icon-box">
                      <i class="fas fa-brackets-curly c-stat__icon"></i>
                    </div>
                    <div class="c-stat__text">
                      <div class="c-stat__label">Critical</div>
                      <div class="c-stat__number">{{ submissionStats.critical }}</div>
                    </div>
                  </div>
                  <!-- /.c-stat -->
                  <div class="c-stat c-stat--severity-high u-m-10">
                    <div class="c-stat__icon-box">
                      <i class="fas fa-brackets-curly c-stat__icon"></i>
                    </div>
                    <div class="c-stat__text">
                      <div class="c-stat__label">High</div>
                      <div class="c-stat__number">{{ submissionStats.high }}</div>
                    </div>
                  </div>
                  <!-- /.c-stat -->
                  <div class="c-stat c-stat--severity-medium u-m-10">
                    <div class="c-stat__icon-box">
                      <i class="fas fa-brackets-curly c-stat__icon"></i>
                    </div>
                    <div class="c-stat__text">
                      <div class="c-stat__label">Medium</div>
                      <div class="c-stat__number">{{ submissionStats.medium }}</div>
                    </div>
                  </div>
                  <!-- /.c-stat -->
                  <div class="c-stat c-stat--severity-low u-m-10">
                    <div class="c-stat__icon-box">
                      <i class="fas fa-brackets-curly c-stat__icon"></i>
                    </div>
                    <div class="c-stat__text">
                      <div class="c-stat__label">Low</div>
                      <div class="c-stat__number">{{ submissionStats.low }}</div>
                    </div>
                  </div>
                  <!-- /.c-stat -->
                  <div class="c-stat c-stat--severity-info u-m-10">
                    <div class="c-stat__icon-box">
                      <i class="fas fa-brackets-curly c-stat__icon"></i>
                    </div>
                    <div class="c-stat__text">
                      <div class="c-stat__label">Info</div>
                      <div class="c-stat__number">{{ submissionStats.informational }}</div>
                    </div>
                  </div>
                  <!-- /.c-stat -->
                </div>
              </div>
              <!-- /.c-box__footer -->
            </div>
            <!-- /.c-box -->
          </div>
          <aside>
            <div class="c-box" v-if="paymentStats">
              <div class="c-box__header">
                <h6 class="o-h6">Bounty Dashboard</h6>
              </div>
              <!-- /.c-box__header -->
              <div class="c-box__body">
                <div class="c-stat c-stat--lg u-mb-40">
                  <div class="c-stat__icon-box">
                    <i class="fas fa-sack-dollar c-stat__icon u-color-primary"></i>
                  </div>
                  <div class="c-stat__text">
                    <div class="c-stat__label">Earned</div>
                    <div class="c-stat__number">{{ paymentStats.earned }}</div>
                  </div>
                </div>
                <!-- /.c-stat -->
                <div class="u-nm-20">
                  <div class="c-stat u-m-20">
                    <div class="c-stat__text">
                      <div class="c-stat__label">Paid</div>
                      <div class="c-stat__number u-d-f u-ai-center u-mt-10">
                        <i class="fas fa-check-circle u-color-success u-font-18"></i>
                        <span class="u-ml-10 u-fw-700">{{ paymentStats.paid }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- /.c-stat -->
                  <div class="c-stat u-m-20">
                    <div class="c-stat__text">
                      <div class="c-stat__label">Pending</div>
                      <div class="c-stat__number u-d-f u-ai-center u-mt-10">
                        <i class="fas fa-clock u-color-primary u-font-18"></i>
                        <span class="u-ml-10 u-fw-700">{{ paymentStats.pending }}</span>
                      </div>
                    </div>
                  </div>
                  <!-- /.c-stat -->
                </div>
              </div>
              <!-- /.c-box__body -->
            </div>
            <!-- /.c-box -->
          </aside>
        </div>
        <div class="u-mt-20">
          <SubmissionList
            :sort-option="sortOption"
            :sort-order="sortOrder"
            :filter-option="filterOption"
            :current-page="submissionsQuery.page"
            :page-count="submissionsQuery.total_pages"
            :submission-count="submissionsQuery.count"
            :submissions="submissions"
            @filter-changed="onFilterChange"
            @sort-changed="onSortChange"
            @page-changed="onPageChange"
          />
        </div>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { STORE_KEY, LOAD_SUBMISSIONS, SET_FILTER_OPTION } from '@/stores/submissions/types'
import { STORE_KEY as ACCOUNT_STORE_KEY, LOAD_DASHBOARD } from '@/stores/account/types'
import SubmissionList from '@/modules/submissions/_components/submission-list/components/SubmissionList'
import { SUBMISSION_FILTER_OPTIONS } from '@/modules/submissions/_components/submission-list/models/submission-filter-options'
import Chart from 'chart.js'
import { getSeverityChartData } from '../_data/severity-chart-data'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'

export default {
  name: 'ResearcherDashboard',
  components: {
    SubmissionList,
  },
  mixins: [BreadcrumbsMixin],
  data() {
    return {
      filterOptions: SUBMISSION_FILTER_OPTIONS,
      initialLoad: true,
      dashboardData: {},
      formatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }),
    }
  },
  computed: {
    ...mapState(STORE_KEY, {
      submissions: (state) => state.submissions,
      filterOption: (state) => state.filterOption,
      sortOption: (state) => state.sortOption,
      sortOrder: (state) => state.sortOrder,
      submissionsQuery: (state) => state.submissionsQuery,
    }),
    paymentStats() {
      if (!this.dashboardData || !this.dashboardData.payment_stats) {
        return null
      }
      const stats = this.dashboardData.payment_stats
      return {
        earned: this.formatter.format(stats.earned),
        paid: this.formatter.format(stats.paid),
        pending: this.formatter.format(stats.pending),
      }
    },
    submissionStats() {
      if (!this.dashboardData) {
        return null
      }
      return this.dashboardData.submission_stats
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionSetFilterOption: SET_FILTER_OPTION,
      actionLoadSubmissions: LOAD_SUBMISSIONS,
    }),
    ...mapActions(ACCOUNT_STORE_KEY, {
      actionLoadDashboard: LOAD_DASHBOARD,
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
      }
      try {
        await this.actionLoadSubmissions()
      } catch (e) {
        const error = e && e.data && e.data.error ? e.data.error : 'Failed to load submissions'
        this.$caAlert.error(error)
      } finally {
        this.$solar.hide()
      }
    },
    createChart(chartId, chartData) {
      const ctx = document.getElementById(chartId)
      // eslint-disable-next-line
      const myChart = new Chart(ctx, {
        type: chartData.type,
        data: chartData.data,
        options: chartData.options,
      })
    },
  },
  async mounted() {
    try {
      this.actionSetBreadcrumbs({
        parent: {
          route: this.$router.resolve({ name: 'Dashboard' }).route,
          title: 'Dashboard',
        },
      })
      this.$solar.show()
      await this.loadSubmissions()

      const dashboard = await this.actionLoadDashboard('researcher')
      this.dashboardData = dashboard

      setTimeout(() => {
        this.createChart('severity-chart', getSeverityChartData(this.submissionStats))
      }, 200)
    } catch (e) {
      const error = e && e.data && e.data.error ? e.data.error : 'Failed to load'
      this.$caAlert.error(error)
    } finally {
      this.$solar.hide()
    }
  },
}
</script>
