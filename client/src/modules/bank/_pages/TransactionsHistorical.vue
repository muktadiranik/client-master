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
    :options="{ disableFilter: true }"
    @filter-changed="onFilterChange"
    @sort-changed="onSortChange"
    @page-changed="onPageChange"
    isPaid
  />
</template>

<script>
import { BankMixin } from '@/modules/bank/_mixins/bank'
import TransactionList from '@/modules/bank/_components/transaction-list/TransactionList'

import {
  STORE_KEY,
  LOAD_TRANSACTIONS,
  SET_FILTER_OPTION,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_TRANSACTIONS_QUERY,
  SET_TRANSACTIONS_QUERY_PAGE,
  RESET_QUERY,
  RESET_STORE,
} from '@/stores/transactions/types'
import store from '@/stores/transactions'
import { mapActions, mapState } from 'vuex'

export default {
  name: 'TransactionsHistorical',
  mixins: [BankMixin],
  components: {
    TransactionList,
  },
  data() {
    return {}
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadTransactions: LOAD_TRANSACTIONS,
      actionSetTransactionsQuery: SET_TRANSACTIONS_QUERY,
      actionResetTransactionsStore: RESET_STORE,
      actionResetQuery: RESET_QUERY,
      actionSetFilterOption: SET_FILTER_OPTION,
      actionSetSortOption: SET_SORT_OPTION,
      actionSetSortOrder: SET_SORT_ORDER,
      actionSetTransactionsQueryPage: SET_TRANSACTIONS_QUERY_PAGE,
    }),
    onQueryChanged(query) {
      this.actionSetTransactionsQuery(query)
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
    onNewTransactionClick() {
      this.$router.push({
        name: 'TransactionCreate',
      })
    },
  },
  computed: {
    ...mapState(STORE_KEY, {
      filterOption: state => state.filterOption,
      loadingTransactions: state => state.loading,
      selectedFilterField: state => state.transactionsQuery.filterField,
      sortOption: state => state.sortOption,
      sortOrder: state => state.sortOrder,
      transactions: state => state.transactions || [],
      transactionsQuery: state => state.transactionsQuery,
    }),
  },
  async created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  async mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }

    this.$solar.show()
    await this.actionResetTransactionsStore()
    await this.actionLoadTransactions()
    await this.actionSetRoute()
    this.$solar.hide()
  },
  beforeDestroy() {
    if (STORE_KEY in this.$store._modules.root._children) {
      this.$store.unregisterModule(STORE_KEY)
    }
  },
}
</script>
