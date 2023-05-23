import {
  STORE_KEY,
  LOAD_TRANSACTIONS,
  LOAD_USER_PROFILE,
  SET_FILTER_OPTION,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_TRANSACTIONS_QUERY,
  SET_TRANSACTIONS_QUERY_PAGE,
  RESET_QUERY,
  RESET_STORE,
} from '@/stores/user-transactions/types'
import store from '@/stores/user-transactions'
import { mapActions, mapState } from 'vuex'

export const UserTransactionsMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      filterOption: state => state.filterOption,
      loadingTransactions: state => state.loading,
      selectedFilterField: state => state.transactionsQuery.filterField,
      sortOption: state => state.sortOption,
      sortOrder: state => state.sortOrder,
      transactions: state => state.transactions || [],
      transactionsQuery: state => state.transactionsQuery,
      userProfile: state => state.userProfile,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadTransactions: LOAD_TRANSACTIONS,
      actionLoadUserProfile: LOAD_USER_PROFILE,
      actionSetTransactionsQuery: SET_TRANSACTIONS_QUERY,
      actionResetStore: RESET_STORE,
      actionResetQuery: RESET_QUERY,
      actionSetFilterOption: SET_FILTER_OPTION,
      actionSetSortOption: SET_SORT_OPTION,
      actionSetSortOrder: SET_SORT_ORDER,
      actionSetTransactionsQueryPage: SET_TRANSACTIONS_QUERY_PAGE,
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
    await this.actionResetStore()
    await this.actionResetQuery()
  },
}
