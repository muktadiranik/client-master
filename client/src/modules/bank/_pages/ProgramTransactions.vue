<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <div class="l-program-transactions">
          <ProgramDetailsSidebar v-if="program" :program="program" />
          <div class="u-overflow-hidden-with-box-shadow">
            <ProgramPendingTransactions v-if="program" :program="program" />
            <div class="u-mt-20">
              <TransactionList
                :sort-option="sortOption"
                :sort-order="sortOrder"
                :filter-option="filterOption"
                :current-page="transactionsQuery.page"
                :page-count="transactionsQuery.total_pages"
                :transaction-count="transactionsQuery.count"
                :transactions="transactions"
                :options="{ disableFilter: true, disableRowToggle: true }"
                @filter-changed="onFilterChange"
                @sort-changed="onSortChange"
                @page-changed="onPageChange"
              />
            </div>
          </div>
        </div>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import TransactionList from '@/modules/bank/_components/transaction-list/TransactionList'
import ProgramPendingTransactions from '@/modules/bank/_components/ProgramPendingTransactions'
import ProgramDetailsSidebar from '@/modules/bank/_components/ProgramDetailsSidebar'
import { AccountMixin } from '@/mixins/account'
import { BankMixin } from '@/modules/bank/_mixins/bank'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { NavbarMixin } from '@/mixins/navbar'
import { ProgramTransactionsMixin } from '@/modules/bank/_mixins/program-transactions'
import { clickOutside } from '@/directives/click-outside'
import { STORE_KEY } from '@/stores/program-transactions/types'
import store from '@/stores/program-transactions'

export default {
  name: 'ProgramTransactions',
  data() {
    return {}
  },
  mixins: [AccountMixin, BankMixin, BreadcrumbsMixin, NavbarMixin, ProgramTransactionsMixin],
  components: {
    TransactionList,
    ProgramDetailsSidebar,
    ProgramPendingTransactions,
  },
  directives: {
    clickOutside,
  },
  methods: {
    async onPageChange(page) {
      await this.actionSetTransactionsQueryPage(page)
    },
    async onFilterChange(option) {
      await this.actionSetFilterOption(option)
    },
    async onSortChange(option) {
      await this.actionSetSortOption(option)
    },
    onQueryChanged(query) {
      this.actionSetTransactionsQuery(query)
    },
  },
  created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(this.storeKey, store)
    }

    this.$solar.show()
    const programUuid = this.$route.params.uuid
    await this.actionResetProgramTransactionsStore()
    await this.actionLoadProgramTransactionsProgram(programUuid)
    await this.actionLoadProgramForNavbar(this.program)
    await this.actionLoadTransactions()
    await this.actionSetRoute()

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
    this.$solar.hide()
  },
}
</script>
