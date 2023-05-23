<template>
  <router-link class="o-btn o-btn--shadow o-btn--sm o-btn--rounded-sm" :to="savedRoute || getDefaultBankRoute">
    <i class="fal fa-chevron-left o-btn__icon-left"></i>
    <span>{{ savedRouteName }}</span>
  </router-link>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { BankMixin } from '@/modules/bank/_mixins/bank'

export default {
  name: 'BankBackButton',
  mixins: [AccountMixin, BankMixin],
  data() {
    return {}
  },
  computed: {
    getDefaultBankRoute() {
      return this.userIsProgramManager() || this.userIsBanker()
        ? { name: 'Transactions' }
        : { name: 'UserProfileTransactions' }
    },
    savedRouteName() {
      if (!this.savedRoute) {
        return 'Transaction Dashboard'
      }

      const meta = this.savedRoute.meta
      return meta && meta.linkText ? meta.linkText : this.savedRoute.name
    },
  },
}
</script>
