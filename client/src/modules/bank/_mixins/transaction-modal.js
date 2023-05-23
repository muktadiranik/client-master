import { STORE_KEY, LOAD_TRANSACTION, CLOSE_MODAL, SHOW_MODAL } from '@/stores/transaction-modal/types'
import store from '@/stores/transaction-modal'
import { mapActions, mapState } from 'vuex'

export const TransactionModalMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      transaction: state => state.transaction,
      transactionModalVisible: state => state.visible,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadTransactionForModal: LOAD_TRANSACTION,
      actionCloseTransactionModal: CLOSE_MODAL,
      actionShowTransactionModal: SHOW_MODAL,
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
    await this.actionCloseTransactionModal()
  },
}
