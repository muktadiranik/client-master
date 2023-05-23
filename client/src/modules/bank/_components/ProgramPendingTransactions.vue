<template>
  <div>
    <TransactionList
      :sort-option="sortOption"
      :sort-order="sortOrder"
      :filter-option="filterOption"
      :current-page="pendingTransactionsQuery.page"
      :page-count="pendingTransactionsQuery.total_pages"
      :transaction-count="pendingTransactionsQuery.count"
      :transactions="pendingTransactions"
      :options="{ disableFilter: true, disableRowToggle: true, title: 'Pending Transactions' }"
      @filter-changed="onFilterChange"
      @sort-changed="onSortChange"
      @page-changed="onPageChange"
    />
  </div>
</template>

<script>
import TransactionList from '@/modules/bank/_components/transaction-list/TransactionList'
import { BankMixin } from '@/modules/bank/_mixins/bank'
import { ProgramPendingTransactionsMixin } from '@/modules/bank/_mixins/program-pending-transactions'

export default {
  name: 'ProgramPendingTransactions',
  data() {
    return {}
  },
  mixins: [BankMixin, ProgramPendingTransactionsMixin],
  components: {
    TransactionList,
  },
  methods: {
    onNewTransactionClick() {
      this.$router.push({
        name: 'TransactionCreate',
        params: {
          programUuid: this.$route.params.uuid,
        },
      })
    },
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
  async mounted() {
    this.$solar.show()
    await this.actionSetProgram(this.$route.params.uuid)
    await this.actionResetPendingTransactionsStore()
    await this.actionLoadPendingTransactions()
    this.$solar.hide()
  },
}
</script>

<style lang="scss">
.pending-transactions-table {
  margin-bottom: 4rem;
}
</style>
