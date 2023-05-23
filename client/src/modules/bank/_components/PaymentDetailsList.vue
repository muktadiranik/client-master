<template>
  <ul class="c-list-group c-list-group--striped-odd c-list-group--flush">
    <li class="c-dictionary l-grid l-grid--row-gap-5 c-dictionary--font-sm" v-if="paymentInfo.paypal_email">
      <div class="c-dictionary__key u-text-mute">PayPal Email Address</div>
      <div class="c-dictionary__value u-d-if u-ai-center">
        <span>{{ paymentInfo.paypal_email }}</span>
        <i class="far fa-check u-ml-10 u-color-primary" v-if="paymentInfo.default_payment_method === 2"></i>
      </div>
    </li>
    <li class="c-dictionary l-grid l-grid--row-gap-5 c-dictionary--font-sm" v-if="paymentInfo.btc_wallet_address">
      <div class="c-dictionary__key u-text-mute">BTC Wallet Address</div>
      <div class="c-dictionary__value u-d-if u-ai-center">
        <span>{{ paymentInfo.btc_wallet_address }}</span>
        <i class="far fa-check u-ml-10 u-color-primary" v-if="paymentInfo.default_payment_method === 3"></i>
      </div>
    </li>
    <li class="c-dictionary l-grid l-grid--row-gap-5 c-dictionary--font-sm" v-if="paymentInfo.eth_wallet_address">
      <div class="c-dictionary__key u-text-mute">ETH Wallet Address</div>
      <div class="c-dictionary__value u-d-if u-ai-center">
        <span>{{ paymentInfo.eth_wallet_address }}</span>
        <i class="far fa-check u-ml-10 u-color-primary" v-if="paymentInfo.default_payment_method === 4"></i>
      </div>
    </li>
    <li
      class="c-dictionary l-grid l-grid--row-gap-5 c-dictionary--font-sm"
      v-if="hasBankInfo && bankInfo.usd_bank_type_display"
    >
      <div class="c-dictionary__key u-text-mute">Bank Account Type</div>
      <div class="c-dictionary__value u-d-if u-ai-center">
        <span>{{ bankInfo.usd_bank_type_display }}</span>
        <i class="far fa-check u-ml-10 u-color-primary" v-if="paymentInfo.default_payment_method === 5"></i>
      </div>
    </li>
    <li
      class="c-dictionary l-grid l-grid--row-gap-5 c-dictionary--font-sm"
      v-if="hasBankInfo && bankInfo.usd_bank_account_number"
    >
      <div class="c-dictionary__key u-text-mute">Bank Account Number</div>
      <div class="c-dictionary__value u-d-if u-ai-center">
        <span>{{ bankInfo.usd_bank_account_number }}</span>
      </div>
    </li>
    <li
      class="c-dictionary l-grid l-grid--row-gap-5 c-dictionary--font-sm"
      v-if="hasBankInfo && bankInfo.usd_bank_routing_number"
    >
      <div class="c-dictionary__key u-text-mute">Bank Routing Number</div>
      <div class="c-dictionary__value u-d-if u-ai-center">
        <span>{{ bankInfo.usd_bank_routing_number }}</span>
      </div>
    </li>
  </ul>
</template>

<script>
export default {
  name: 'PaymentDetailsList',
  props: {
    paymentInfo: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  data() {
    return {}
  },
  computed: {
    bankInfo() {
      if (!this.paymentInfo) {
        return null
      }

      return this.paymentInfo.usd_bank || null
    },
    hasBankInfo() {
      if (!this.bankInfo) {
        return false
      }

      if (!this.bankInfo.usd_bank_account_number) {
        return false
      }

      return true
    },
  },
}
</script>
