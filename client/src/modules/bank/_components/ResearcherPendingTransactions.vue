<template>
  <TransactionList
    :sort-option="sortOption"
    :sort-order="sortOrder"
    :filter-option="filterOption"
    :current-page="pendingTransactionsQuery.page"
    :page-count="pendingTransactionsQuery.total_pages"
    :transaction-count="getTransactionCount"
    :transactions="pendingTransactions"
    :options="tableOptions"
    @filter-changed="onFilterChange"
    @sort-changed="onSortChange"
    @page-changed="onPageChange"
  />
</template>

<script>
import TransactionList from '@/modules/bank/_components/transaction-list/TransactionList'
import { BankMixin } from '@/modules/bank/_mixins/bank'
import { ResearcherPendingTransactionsMixin } from '@/modules/bank/_mixins/researcher-pending-transactions'

export default {
  name: 'ResearcherPendingTransactions',
  data() {
    return {
      tableOptions: {
        disableFilter: true,
        disableRowToggle: true,
        title: 'Pending Transactions',
      },
    }
  },
  mixins: [BankMixin, ResearcherPendingTransactionsMixin],
  components: {
    TransactionList,
  },
  computed: {
    getTransactionCount() {
      if (!this.pendingTransactions) {
        return 0
      }
      return this.pendingTransactions.length || 0
    },
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
    await this.actionLoadPendingTransactions()
    this.$emit('get-pending-count', this.pendingTransactions.length)
    this.$solar.hide()
  },
}
</script>

<style lang="scss">
.pending-transactions-table {
  margin-bottom: 4rem;
}
</style>
