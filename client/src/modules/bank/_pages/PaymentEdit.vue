<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <PaymentTransactionEditor v-if="!createPaymentTransactionsLoading" :create-mode="false" />
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import PaymentTransactionEditor from '@/modules/bank/_components/PaymentTransactionEditor'
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { CreatePaymentMixin } from '@/modules/bank/_mixins/create-payment'

export default {
  name: 'PaymentEdit',
  mixins: [BreadcrumbsMixin, CreatePaymentMixin],
  components: {
    PaymentTransactionEditor,
  },
  data() {
    return {}
  },
  async mounted() {
    this.$solar.show()
    await this.actionSetLoading(true)
    try {
      const paymentUuid = this.$route.params.uuid
      if (paymentUuid) {
        await this.actionLoadPayment(paymentUuid)
        await this.actionLoadUserProfile(this.payment.recipient.uuid)
      }

      await this.actionLoadTransactions()

      this.actionSetBreadcrumbs({
        parent: {
          route: this.$router.resolve({ name: 'Transactions' }).route,
          title: 'Bank',
        },
        child: {
          title: 'Payments',
          route: this.$router.resolve({ name: 'Transactions' }).route,
        },
        grandChild: {
          title: this.payment.payment_id,
          copyValue: this.payment.uuid,
          route: this.$router.resolve({ name: 'PaymentDetailsPage', params: { uuid: this.payment.uuid } }).route,
        },
      })
    } catch (e) {
      this.$caAlert.error('Failed to load payment')
    } finally {
      this.$solar.hide()
      await this.actionSetLoading(false)
    }
  },
  async beforeDestroy() {
    await this.actionResetCreatePaymentStore()
  },
}
</script>
