<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <PaymentTransactionEditor v-if="userProfile" :create-mode="true" />
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
  name: 'PaymentCreate',
  mixins: [BreadcrumbsMixin, CreatePaymentMixin],
  components: {
    PaymentTransactionEditor,
  },
  data() {
    return {}
  },
  async mounted() {
    try {
      this.$solar.show()
      await this.actionSetLoading(true)

      const userUuid = this.$route.params.userUuid
      if (userUuid) {
        await this.actionLoadUserProfile(userUuid)
      }

      await this.actionLoadTransactions()
      await this.actionToggleAllTransactions()

      this.actionSetBreadcrumbs({
        parent: {
          route: this.$router.resolve({ name: 'Transactions' }).route,
          title: 'Bank',
        },
        child: {
          title: 'Payments',
          route: this.$router.resolve({ name: 'Transactions' }).route,
          enableCopyButton: true,
        },
        grandChild: {
          title: 'New',
        },
      })
    } catch (e) {
    } finally {
      await this.actionSetLoading(false)
      this.$solar.hide()
    }
  },
  async beforeDestroy() {
    await this.actionResetCreatePaymentStore()
  },
}
</script>
