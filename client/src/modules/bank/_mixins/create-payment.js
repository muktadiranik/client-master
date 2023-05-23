import {
  STORE_KEY,
  CREATE_PAYMENT,
  EDIT_PAYMENT,
  EDIT_PAYMENT_TRANSACTIONS,
  EDIT_USER_PROFILE,
  LOAD_PAYMENT,
  LOAD_USER_PROFILE,
  LOAD_TRANSACTIONS,
  SET_LOADING,
  SET_TRANSACTIONS_QUERY,
  SET_PAYMENT_OPTION,
  TOGGLE_ALL_TRANSACTIONS,
  TOGGLE_TRANSACTION_EDITOR_ENABLED,
  TOGGLE_TRANSACTION_SELECTED,
  RESET_STORE,
} from '@/stores/create-payment/types'
import store from '@/stores/create-payment'
import { mapActions, mapState } from 'vuex'

export const CreatePaymentMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      selectedTransactions: state => state.selectedTransactions,
      transactions: state => state.transactions || [],
      selectedFilterField: state => state.transactionsQuery.filterField,
      userProfile: state => state.userProfile,
      transactionEditorEnabled: state => state.transactionEditorEnabled,
      payment: state => state.payment,
      createPaymentTransactionsLoading: state => state.loading,
      toggleAllActive: state => state.toggleAllActive,
      notes: state => state.notes,
      referenceId: state => state.referenceId,
      paymentMethod: state => state.paymentMethod,
      btcWalletAddress: state => state.btcWalletAddress,
      ethWalletAddress: state => state.ethWalletAddress,
      paypalEmailAddress: state => state.paypalEmailAddress,
      bankAccountNumber: state => state.bankAccountNumber,
      bankRoutingNumber: state => state.bankRoutingNumber,
      bankType: state => state.bankType,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionCreatePayment: CREATE_PAYMENT,
      actionEditPayment: EDIT_PAYMENT,
      actionEditPaymentTransactions: EDIT_PAYMENT_TRANSACTIONS,
      actionEditUserProfile: EDIT_USER_PROFILE,
      actionLoadPayment: LOAD_PAYMENT,
      actionLoadTransactions: LOAD_TRANSACTIONS,
      actionLoadUserProfile: LOAD_USER_PROFILE,
      actionSetLoading: SET_LOADING,
      actionSetTransactionsQuery: SET_TRANSACTIONS_QUERY,
      actionToggleAllTransactions: TOGGLE_ALL_TRANSACTIONS,
      actionToggleTransactionEditorEnabled: TOGGLE_TRANSACTION_EDITOR_ENABLED,
      actionToggleTransactionSelected: TOGGLE_TRANSACTION_SELECTED,
      actionResetCreatePaymentStore: RESET_STORE,
      actionSetPaymentOption: SET_PAYMENT_OPTION,
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
    await this.actionResetCreatePaymentStore()
  },
}
