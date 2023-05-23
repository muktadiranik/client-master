import { STORE_KEY, LOAD_PAYMENT, CLOSE_MODAL, SHOW_MODAL } from '@/stores/payment-modal/types'
import store from '@/stores/payment-modal'
import { mapActions, mapState } from 'vuex'

export const PaymentModalMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      payment: state => state.payment,
      paymentModalVisible: state => state.visible,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadPaymentForModal: LOAD_PAYMENT,
      actionClosePaymentModal: CLOSE_MODAL,
      actionShowPaymentModal: SHOW_MODAL,
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
    await this.actionClosePaymentModal()
  },
}
