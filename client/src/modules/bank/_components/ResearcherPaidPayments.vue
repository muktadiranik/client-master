<template>
  <div>
    <TransactionList
      :sort-option="sortOption"
      :sort-order="sortOrder"
      :filter-option="filterOption"
      :current-page="transactionsQuery.page"
      :page-count="transactionsQuery.total_pages"
      :transaction-count="transactionsQuery.count"
      :transactions="transactions"
      :options="{ disableFilter: true }"
      @filter-changed="onFilterChange"
      @sort-changed="onSortChange"
      @page-changed="onPageChange"
      isPaid
    />
  </div>
</template>

<script>
import TransactionList from '@/modules/bank/_components/transaction-list/TransactionList'
import { UserProfileTransactionsMixin } from '@/modules/bank/_mixins/user-profile-transactions'

export default {
  name: 'ResearcherPaidPayments',
  components: {
    TransactionList,
  },
  mixins: [UserProfileTransactionsMixin],
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
}
</script>
