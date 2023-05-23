import {
  STORE_KEY,
  CREATE_TRANSACTION,
  DELETE_TRANSACTION,
  EDIT_TRANSACTION,
  GET_PENDING_SUBMISSIONS,
  GET_PROGRAM,
  GET_TRANSACTION,
  GET_TRANSACTION_LIST,
  GET_USER_PROFILE,
  LOAD_TRANSACTION_TYPES,
  LOAD_PROGRAMS_LIST,
  RESET_STORE,
  SEARCH_RESEARCHERS,
  SET_ROUTE,
} from '@/stores/bank/types'
import store from '@/stores/bank'
import { mapActions, mapState } from 'vuex'

export const BankMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      transactionTypes: state => state.transactionTypes,
      programs: state => state.programs,
      savedRoute: state => state.savedRoute,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionCreateTransaction: CREATE_TRANSACTION,
      actionDeleteTransaction: DELETE_TRANSACTION,
      actionEditTransaction: EDIT_TRANSACTION,
      actionGetPendingSubmissions: GET_PENDING_SUBMISSIONS,
      actionGetProgram: GET_PROGRAM,
      actionGetUserProfile: GET_USER_PROFILE,
      actionGetTransaction: GET_TRANSACTION,
      actionGetTransactionList: GET_TRANSACTION_LIST,
      actionLoadTransactionTypes: LOAD_TRANSACTION_TYPES,
      actionLoadProgramsList: LOAD_PROGRAMS_LIST,
      actionResetStore: RESET_STORE,
      actionSearchResearchers: SEARCH_RESEARCHERS,
      actionSetRoute: SET_ROUTE,
    }),
  },
  created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
  mounted() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule(STORE_KEY, store)
    }
  },
}
