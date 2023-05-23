import {
  STORE_KEY,
  LOAD_PROGRAM_TRANSACTIONS_PROGRAM,
  LOAD_TRANSACTIONS,
  SET_FILTER_OPTION,
  SET_SORT_OPTION,
  SET_SORT_ORDER,
  SET_TRANSACTIONS_QUERY,
  SET_TRANSACTIONS_QUERY_PAGE,
  RESET_QUERY,
  RESET_PROGRAM_TRANSACTIONS_STORE,
} from '@/stores/program-transactions/types'
import store from '@/stores/program-transactions'
import { mapActions, mapState } from 'vuex'

export const ProgramTransactionsMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      filterOption: state => state.filterOption,
      loadingTransactions: state => state.loading,
      selectedFilterField: state => state.transactionsQuery.filterField,
      sortOption: state => state.sortOption,
      sortOrder: state => state.sortOrder,
      transactions: state => state.transactions || [],
      transactionsQuery: state => state.transactionsQuery,
      program: state => state.program,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadTransactions: LOAD_TRANSACTIONS,
      actionSetTransactionsQuery: SET_TRANSACTIONS_QUERY,
      actionResetProgramTransactionsStore: RESET_PROGRAM_TRANSACTIONS_STORE,
      actionResetQuery: RESET_QUERY,
      actionSetFilterOption: SET_FILTER_OPTION,
      actionSetSortOption: SET_SORT_OPTION,
      actionSetSortOrder: SET_SORT_ORDER,
      actionSetTransactionsQueryPage: SET_TRANSACTIONS_QUERY_PAGE,
      actionLoadProgramTransactionsProgram: LOAD_PROGRAM_TRANSACTIONS_PROGRAM,
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
    await this.actionResetProgramTransactionsStore()
  },
}
