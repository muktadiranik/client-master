<template>
  <PendingTransactionList
    :sort-option="sortOption"
    :sort-order="sortOrder"
    :filter-option="filterOption"
    :current-page="pendingTransactionsQuery.page"
    :page-count="pendingTransactionsQuery.total_pages"
    :transaction-count="pendingTransactionsQuery.count"
    :transactions="pendingTransactions"
    :loading="loading"
    @filter-changed="onFilterChange"
    @sort-changed="onSortChange"
    @page-changed="onPageChange"
  />
</template>

<script>
import PendingTransactionList from '@/modules/bank/_components/pending-transactions-list/PendingTransactionList'
import { BankMixin } from '@/modules/bank/_mixins/bank'
import { PendingTransactionsMixin } from '@/modules/bank/_mixins/pending-transactions'

export default {
  name: 'PendingTransactionsTable',
  data() {
    return {
      loading: false,
    }
  },
  mixins: [BankMixin, PendingTransactionsMixin],
  components: {
    PendingTransactionList,
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
    await this.actionResetPendingTransactionsStore()
    this.loading = true
    await this.actionLoadPendingTransactions()
    this.loading = false
    this.$solar.hide()
  },
}
</script>

<style lang="scss">
.pending-transactions-table {
  margin-bottom: 4rem;
}
</style>
