import { STORE_KEY, DELETE_PAYMENT, LOAD_PAYMENT, RESET_STORE } from '@/stores/payment/types'
import store from '@/stores/payment'
import { mapActions, mapState } from 'vuex'

export const PaymentMixin = {
  computed: {
    ...mapState(STORE_KEY, {
      payment: state => state.payment,
    }),
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionLoadPayment: LOAD_PAYMENT,
      actionDeletePayment: DELETE_PAYMENT,
      actionResetPaymentStore: RESET_STORE,
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
    await this.actionResetPaymentStore()
  },
}
