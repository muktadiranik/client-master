<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap" v-if="paymentStats">
        <h2 class="u-fs-22 u-mb-20">Payments</h2>
        <div class="l-flex u-mb-20">
          <div class="c-submissions__header-box c-submissions__header-box--paid u-border-primary u-mr-10">
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
        <div class="u-mb-20" style="width: 220px">
          <SearchTransactionByName ref="SearchTransactionByName" :inputText="inputText" @apply-search-text="applySearchText" />
        </div>
        <!-- TAB NAVIGATION -->
        <nav class="c-tab-nav u-mb-15">
          <ul class="c-tab-nav__list">
            <li @click="changeTab('pending')" :class="{ 'is-active': currentTab === 'pending' }">
              <span>Pending ({{ pendingTransactionCount }})</span>
            </li>
            <li @click="changeTab('paid')" :class="{ 'is-active': currentTab === 'paid' }">
              <span>Paid ({{ transactions.length }})</span>
            </li>
          </ul>
        </nav>
        <ResearcherPendingTransactions
          v-show="currentTab === 'pending'"
          @get-pending-count="getPendingTransactionCount"
        />
        <div class="u-mt-20" v-if="user && transactions" v-show="currentTab == 'paid'">
          <ResearcherPaidPayments />
        </div>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import ResearcherPendingTransactions from '@/modules/bank/_components/ResearcherPendingTransactions'
import ResearcherPaidPayments from '@/modules/bank/_components/ResearcherPaidPayments'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { UserProfileTransactionsMixin } from '@/modules/bank/_mixins/user-profile-transactions'
import { mapActions } from 'vuex'
import { STORE_KEY, LOAD_DASHBOARD } from '@/stores/account/types'
import SearchTransactionByName from '@/modules/bank/_components/transaction-list/SearchTransactionByName'
import { ResearcherPendingTransactionsMixin } from '@/modules/bank/_mixins/researcher-pending-transactions'

export default {
  name: 'UserProfileTransactions',
  components: {
    ResearcherPaidPayments,
    ResearcherPendingTransactions,
    SearchTransactionByName,
  },
  mixins: [BreadcrumbsMixin, UserProfileTransactionsMixin, ResearcherPendingTransactionsMixin],
  data() {
    return {
      user: undefined,
      currentTab: 'pending',
      inputText: '',
      pendingTransactionCount: 0,
      dashboardData: null,
      formatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 0,
      }),
    }
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadDashboard: LOAD_DASHBOARD,
    }),
    getPendingTransactionCount(val) {
      this.pendingTransactionCount = val
    },
    applySearchText(val) {
      // actionSetTransactionsTitleQuery is for Payments query
      this.inputText = val
      this.currentTab === 'pending'
        ? this.actionSetResearcherPendingTransactionsQueryTitle(val)
        : this.actionSetTransactionsTitleQuery(val)
    },
    clearSearchText() {
      this.applySearchText('')
    },
    changeTab(tabName) {
      this.currentTab = tabName
      this.inputText = ''
      this.$refs.SearchTransactionByName.clearSearchText()
      // actionSetTransactionsTitleQuery is for Payments query
      this.currentTab === 'pending'
        ? this.actionSetResearcherPendingTransactionsQueryTitle('')
        : this.actionSetTransactionsTitleQuery('')
    },
  },
  computed: {
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
  },
  async mounted() {
    this.user = this.$store.getters['$account/GET_PROFILE']
    await this.actionLoadTransactions()

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$route,
        title: 'Bank',
      },
      child: {
        route: this.$route,
        title: 'Payments',
      },
    })
  },
  async created() {
    const dashboard = await this.actionLoadDashboard('researcher')
    this.dashboardData = dashboard
  },
}
</script>
