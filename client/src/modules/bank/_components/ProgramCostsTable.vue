<template>
  <div class="table-responsive">
    <div class="payment-items-list-table program-costs-list-table">
      <ul class="payment-items-list">
        <li class="payment-item">
          <div class="column column-date column-items"># Items</div>
          <div class="column column-desc column-program-name">Program Name</div>
          <div class="column column-amount">Amount</div>
        </li>
        <li class="payment-item" v-for="(item, index) in programCosts" :key="`program-cost-${index}`">
          <div class="column column-date column-items">3</div>
          <div class="column column-desc column-program-name">
            <router-link
              :to="{ name: 'ProgramTransactions', params: { uuid: item.program.uuid } }"
              class="platform-name"
              >{{ item.program.title }}</router-link
            >
          </div>
          <div class="column column-amount">${{ item.amount }}</div>
        </li>
        <li class="payment-item last">
          <div>
            <span class="key">Total Amount</span>
            <span class="val">${{ programCostsTotal }}</span>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'

export default {
  name: 'ProgramCostsTable',
  mixins: [AccountMixin],
  props: {
    programCosts: {
      type: Object,
      default: () => {},
      required: true,
    },
    programCostsTotal: {
      type: String,
      default: '',
      required: true,
    },
  },
  data() {
    return {}
  },
}
</script>
