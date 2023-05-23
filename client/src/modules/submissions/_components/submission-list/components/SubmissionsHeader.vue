<template>
  <div class="c-submissions__header" :style="cssProps">
    <div class="l-wrap l-flex u-flex-wrap {">
      <div v-if="paymentStats" class="c-submissions__header--paid-pending">
        <div class="c-submissions__header-box c-submissions__header-box--paid u-border-primary">
          <div class="c-submissions__header-box-body">
            <div class="o-text--dark u-mb-8">Paid</div>
            <div class="o-text--dark u-fs-22 o-text--500">{{ paymentStats.paid }}</div>
          </div>
        </div>
        <div class="c-submissions__header-box c-submissions__header-box--pending">
          <div class="c-submissions__header-box-body">
            <div class="o-text--dark u-mb-8">Pending</div>
            <div class="u-fs-22 o-text--500">{{ paymentStats.pending }}</div>
          </div>
        </div>
      </div>
      <div
        v-if="severityStats && submissionStats && statusStats.all"
        class="c-submissions__header-box c-submissions__header-box--submissions"
      >
        <div class="u-border-bottom">
          <div class="c-submissions__header-box-head">
            <div>Submissions</div>
          </div>
        </div>
        <div class="c-submissions__header-box-body l-flex u-ai-center">
          <vc-donut :sections="submissionsSections" :total="statusStats.all > 0 ? statusStats.all : 100" :size="107">
            <div class="u-fs-12">Total</div>
            <div class="u-fs-24 o-text--dark o-text--500">{{ statusStats.all }}</div>
          </vc-donut>
          <div class="l-flex u-flex-wrap">
            <div class="c-submissions__header-box-body-item c-submissions__header-box-body-item--accepted">
              <div>Accepted</div>
              <div class="o-text--dark o-text--500 u-fs-16">{{ statusStats.accepted }}</div>
            </div>
            <div class="c-submissions__header-box-body-item c-submissions__header-box-body-item--rejected">
              <div>Rejected</div>
              <div class="o-text--dark o-text--500 u-fs-16">{{ statusStats.rejected }}</div>
            </div>
            <div class="c-submissions__header-box-body-item c-submissions__header-box-body-item--duplicate">
              <div>Duplicate</div>
              <div class="o-text--dark o-text--500 u-fs-16">{{ statusStats.duplicate }}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        v-if="severityStats && submissionStats && statusStats.accepted"
        class="c-submissions__header-box c-submissions__header-box--accepted"
      >
        <div class="u-border-bottom">
          <div class="c-submissions__header-box-head">
            <div>Accepted Findings</div>
          </div>
        </div>
        <div class="c-submissions__header-box-body l-flex u-ai-center">
          <vc-donut
            :sections="acceptedSections"
            :total="statusStats.accepted > 0 ? statusStats.accepted : 100"
            :size="107"
          >
            <div class="u-fs-12">Total</div>
            <div class="u-fs-24 o-text--dark o-text--500">{{ statusStats.accepted }}</div>
          </vc-donut>
          <div class="l-flex c-submissions__header-box-body-items">
            <div class="c-submissions__header-box-body-item c-submissions__header-box-body-item--critical">
              <div>Critical</div>
              <div class="o-text--dark o-text--500 u-fs-16">{{ severityStats.critical }}</div>
            </div>
            <div class="c-submissions__header-box-body-item c-submissions__header-box-body-item--high">
              <div>High</div>
              <div class="o-text--dark o-text--500 u-fs-16">{{ severityStats.high }}</div>
            </div>
            <div class="c-submissions__header-box-body-item c-submissions__header-box-body-item--medium">
              <div>Medium</div>
              <div class="o-text--dark o-text--500 u-fs-16">{{ severityStats.medium }}</div>
            </div>
            <div class="c-submissions__header-box-body-item c-submissions__header-box-body-item--low">
              <div>Low</div>
              <div class="o-text--dark o-text--500 u-fs-16">{{ severityStats.low }}</div>
            </div>
            <div class="c-submissions__header-box-body-item c-submissions__header-box-body-item--info">
              <div>Info</div>
              <div class="o-text--dark o-text--500 u-fs-16">{{ severityStats.informational }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions } from 'vuex'
import { STORE_KEY, LOAD_DASHBOARD } from '@/stores/account/types'
import AccountService from '@/services/api/account-service'

export default {
  name: 'SubmissionsHeader',
  data() {
    return {
      dashboardData: null,
      severityStats: {},
      statusStats: {},
      formatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }),
      submissionsSections: [],
      acceptedSections: [],
    }
  },
  computed: {
    cssProps() {
      return {
        '--pending-value': parseInt((this.submissionStats.pending * 100) / this.submissionStats.total) + '%',
        '--closed-value': parseInt((this.submissionStats.closed * 100) / this.submissionStats.total) + '%',
        '--critical-value': parseInt((this.severityStats.critical * 100) / this.submissionStats.accepted) + '%',
        '--high-value': parseInt((this.severityStats.high * 100) / this.severityStats.accepted) + '%',
        '--medium-value': parseInt((this.severityStats.medium * 100) / this.severityStats.accepted) + '%',
        '--low-value': parseInt((this.severityStats.low * 100) / this.severityStats.accepted) + '%',
        '--info-value': parseInt((this.severityStats.info * 100) / this.severityStats.accepted) + '%',
      }
    },
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
      if (!this.statusStats || !this.statusStats) {
        return null
      }
      const submissionStats = this.statusStats
      return {
        total: submissionStats.all,
        pending: submissionStats.new + submissionStats['in-review'] + submissionStats.validating,
        invalid: submissionStats.rejected,
        duplicate: submissionStats.duplicate,
        closed: submissionStats.closed,
      }
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadDashboard: LOAD_DASHBOARD,
    }),
  },
  async created() {
    try {
      const dashboard = await this.actionLoadDashboard('researcher')
      this.dashboardData = dashboard
      this.severityStats = dashboard.submission_stats
      this.acceptedSections = [
        {
          value: this.severityStats.critical,
          color: '#C00000',
        },
        {
          value: this.severityStats.high,
          color: '#FF0000',
        },
        {
          value: this.severityStats.medium,
          color: '#FF8B00',
        },
        {
          value: this.severityStats.low,
          color: '#FFC400',
        },
        {
          value: this.severityStats.informational,
          color: '#008DA6',
        },
      ]
      const submissionStatsReq = await AccountService.getSubmissionStats()
      this.statusStats = submissionStatsReq.data.stats
      this.submissionsSections = [
        {
          value: this.statusStats.accepted,
          color: '#13AC87',
        },
        {
          value: this.statusStats.rejected,
          color: '#FF5C70',
        },
        {
          value: this.statusStats.duplicate,
          color: '#6B778C',
        },
      ]
    } catch (error) {}
  },
}
</script>

<style lang="scss">
.c-submissions__header {
  &-body {
    &-block {
      &-chart {
        &-pending {
          width: var(--pending-value);
        }
        &-closed {
          width: var(--closed-value);
        }
        &-critical {
          width: var(--critical-value);
        }
        &-high {
          width: var(--high-value);
        }
        &-medium {
          width: var(--medium-value);
        }
        &-low {
          width: var(--low-value);
        }
        &-info {
          width: var(--info-value);
        }
      }
    }
  }
}

.closed-container {
  display: block !important;
  padding-left: 0 !important;
}

.closed-container > div:first-child {
  display: flex !important;
  align-items: center !important;
  justify-content: space-between !important;
  padding-left: 1em;
}

.closed-sidebar {
  padding-left: 0;
}

.closed-subclass {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-left: 2em;
}
</style>
