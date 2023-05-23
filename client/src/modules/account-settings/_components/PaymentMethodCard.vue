<template>
  <div>
    <!-- selected payment paypal -->
    <div v-if="selectedPayment === 2" class="l-account-settings-paypal">
      <i class="fab fa-paypal u-fs-16"></i>
      <div class="">
        <div class="u-fs-14 o-text--500 u-mb-5">PayPal</div>
        <div class="u-fs-11">
          <span>{{ profile.paypal_email }}</span>
        </div>
      </div>
    </div>
    <!-- selected payment btc -->
    <div v-if="selectedPayment === 3" class="l-account-settings-paypal">
      <i class="fab fa-btc u-fs-16"></i>
      <div class="">
        <div class="u-fs-14 o-text--500 u-mb-5">BTC</div>
        <div class="u-fs-11">
          <span>{{ profile.btc_wallet_address }}</span>
        </div>
      </div>
    </div>
    <!-- selected payment eth -->
    <div v-if="selectedPayment === 4" class="l-account-settings-paypal">
      <i class="fab fa-ethereum u-fs-16"></i>
      <div class="">
        <div class="u-fs-14 o-text--500 u-mb-5">ETH</div>
        <div class="u-fs-11">
          <span>{{ profile.eth_wallet_address }}</span>
        </div>
      </div>
    </div>
    <!-- selected payment bank -->
    <div v-if="selectedPayment === 5" class="l-account-settings-paypal">
      <i class="fas fa-credit-card u-fs-16"></i>
      <div class="">
        <div class="u-fs-14 o-text--500 u-mb-5">Bank</div>
        <div class="u-fs-11">
          <span>Account number: {{ profile.usd_bank_account_number }}</span>
        </div>
        <div class="u-fs-11">
          <span>Routing number: {{ profile.usd_bank_routing_number }}</span>
        </div>
        <div class="u-fs-11">
          <span>Account type: {{ profile.usd_bank_type === 1 ? 'Checking' : 'Savings' }}</span>
        </div>
      </div>
    </div>
    <!-- selected payment bank -->
    <div v-if="selectedPayment === 6" class="l-account-settings-paypal">
      <i class="fas fa-money-bill u-fs-16"></i>
      <div class="">
        <div class="u-fs-14 o-text--500 u-mb-5">Payoneer</div>
        <div class="u-fs-11">
          <span>{{ profile.payoneer_email}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PaymentMethodCard',
  props: {
    profile: {
      type: Object,
      required: true,
    },
    selectedPayment: {
      type: Number,
      required: true,
    },
  },
}
</script>
