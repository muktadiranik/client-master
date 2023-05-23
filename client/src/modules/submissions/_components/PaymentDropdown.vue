<template>
  <div class="c-dropdown c-dropdown--select" v-click-outside="hideDropdownMenu">
    <div
      class="c-dropdown__toggle o-btn o-btn--rounded o-btn--select"
      tabindex="0"
      :class="[{ 'is-open': expanded }]"
      @click="toggleDropdownMenu"
    >
      <span>{{ selectedPaymentStatus || 'Payment' }}</span>
    </div>
    <ul class="c-dropdown__menu" :class="{ 'is-visible': expanded }">
      <li @click="selectPayment('')">All</li>
      <li
        v-for="(payment, index) in paymentOptions"
        :key="`payment-${index}`"
        @click="selectPayment(payment)"
      >
        <span>
          {{ payment }}
        </span>
      </li>
    </ul>
  </div>
</template>

<script>
import { AccountMixin } from 'mixins/account'
import { clickOutside } from '@/directives/click-outside'

export default {
  name: 'PaymentDropdown',
  components: {},
  directives: {
    clickOutside,
  },
  mixins: [AccountMixin],
  props: {
    selectedPaymentStatus: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      expanded: false,
      paymentOptions: ['Pending', 'Paid'],
      selectedPayment: 'Payment',
    }
  },
  methods: {
    toggleDropdownMenu(event) {
      this.expanded = !this.expanded
    },
    hideDropdownMenu() {
      this.expanded = false
    },
    selectPayment(payment) {
      this.selectedPayment = payment
      this.expanded = false
      this.$emit('set-payment-query', payment)
    },
  },
}
</script>
