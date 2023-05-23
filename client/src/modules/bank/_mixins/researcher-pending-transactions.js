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
  SET_TRANSACTIONS_QUERY_TITLE,
} from '@/stores/researcher-pending-transactions/types'
import store from '@/stores/researcher-pending-transactions'
import { mapActions, mapState } from 'vuex'

export const ResearcherPendingTransactionsMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      filterOption: state => state.filterOption,
      loadingTransactions: state => state.loading,
      selectedFilterField: state => state.transactionsQuery.filterField,
      sortOption: state => state.sortOption,
      sortOrder: state => state.sortOrder,
      pendingTransactions: state => state.transactions || [],
      pendingTransactionsQuery: state => state.transactionsQuery,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadPendingTransactions: LOAD_TRANSACTIONS,
      actionSetTransactionsQuery: SET_TRANSACTIONS_QUERY,
      actionResetPendingTransactionsStore: RESET_STORE,
      actionResetQuery: RESET_QUERY,
      actionSetFilterOption: SET_FILTER_OPTION,
      actionSetSortOption: SET_SORT_OPTION,
      actionSetSortOrder: SET_SORT_ORDER,
      actionSetTransactionsQueryPage: SET_TRANSACTIONS_QUERY_PAGE,
      actionSetResearcherPendingTransactionsQueryTitle: SET_TRANSACTIONS_QUERY_TITLE,
    }),
  },
  created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(this.storeKey, store)
    }
  },
  async beforeDestroy() {
    await this.actionResetPendingTransactionsStore()
    await this.actionResetQuery()
  },
}
