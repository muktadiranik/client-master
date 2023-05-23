<template>
  <TransactionList
    v-if="transactions"
    :sort-option="sortOption"
    :sort-order="sortOrder"
    :filter-option="filterOption"
    :current-page="transactionsQuery.page"
    :page-count="transactionsQuery.total_pages"
    :transaction-count="transactionsQuery.count"
    :transactions="transactions"
    :options="{ disableFilter: true, disableRowToggle: true, title: 'Pending Transactions' }"
    @filter-changed="onFilterChange"
    @sort-changed="onSortChange"
    @page-changed="onPageChange"
  />
</template>

<script>
import TransactionList from '@/modules/bank/_components/transaction-list/TransactionList'
import { BankMixin } from '@/modules/bank/_mixins/bank'
import { TableOptionsMixin } from '@/modules/bank/_mixins/table-options'
import { UserPendingTransactionsMixin } from '@/modules/bank/_mixins/user-pending-transactions'

export default {
  name: 'UserPendingTransactions',
  mixins: [BankMixin, TableOptionsMixin, UserPendingTransactionsMixin],
  components: {
    TransactionList,
  },
  data() {
    return {}
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
  async mounted() {
    this.$solar.show()
    const userProfileUuid = this.$route.params.uuid
    await this.actionLoadUserProfile(userProfileUuid)
    await this.actionResetUserPendingTransactionsStore()
    await this.actionLoadUserPendingTransactions()
    this.$solar.hide()
  },
}
</script>
