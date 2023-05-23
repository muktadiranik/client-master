<template>
  <div class="c-datatable c-datatable--payment-details">
    <div class="c-datatable__responsive">
      <table class="c-datatable__table">
        <thead class="c-datatable__head">
          <tr class="c-datatable__row">
            <td class="c-datatable__cell">
              <span class="c-datatable__col-date">Date</span>
            </td>
            <td class="c-datatable__cell">
              <span class="c-datatable__col-transaction">Transaction</span>
            </td>
            <td class="c-datatable__cell">
              <span class="c-datatable__col-program">Program</span>
            </td>
            <td class="c-datatable__cell">
              <div class="c-datatable__col-amount u-text-right">Amount</div>
            </td>
          </tr>
        </thead>
        <tbody class="c-datatable__body">
          <tr class="c-datatable__row" v-for="(transaction, index) in transactions" :key="`transaction-item-${index}`">
            <td class="c-datatable__cell">
              <div class="c-datatable__col-date">{{ transaction.payment_date | date }}</div>
            </td>
            <td class="c-datatable__cell">
              <div class="c-datatable__col-transaction">
                <router-link :to="{ name: 'TransactionDetails', params: { uuid: transaction.uuid } }">{{
                  transaction.title
                }}</router-link>
              </div>
            </td>
            <td class="c-datatable__cell">
              <div class="c-datatable__col-program">
                <router-link
                  :to="{ name: 'Program', params: { uuid: transaction.program.uuid } }"
                  v-if="!userIsProgramManager() && !userIsBanker()"
                  >{{ transaction.program.title }}</router-link
                >
                <router-link
                  v-if="userIsProgramManager() || userIsBanker()"
                  :to="{ name: 'ProgramTransactions', params: { uuid: transaction.program.uuid } }"
                  class="platform-name"
                  >{{ transaction.program.title }}</router-link
                >
              </div>
            </td>
            <td class="c-datatable__cell">
              <div class="c-datatable__col-amount u-text-right">${{ Math.floor(transaction.amount) }}</div>
            </td>
          </tr>
        </tbody>
        <tfoot class="c-datatable__foot">
          <tr class="c-datatable__row">
            <td class="c-datatable__cell" colspan="10">
              <div class="u-d-f u-ai-center u-jc-fe">
                <span class="u-text-mute u-mr-10">Total Amount:</span>
                <span class="o-text o-text--lg u-fw-700 u-text-dark">${{ paymentTotalAmount }}</span>
              </div>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
    <!-- /.c-datatable__responsive -->
  </div>
  <!-- /.c-datatable -->
</template>

<script>
import DateTimeFilters from '@/filters/date-time-filters'
import { AccountMixin } from '@/mixins/account'

export default {
  name: 'ItemizedTransactionTable',
  filters: { ...DateTimeFilters },
  mixins: [AccountMixin],
  props: {
    transactions: {
      type: Array,
      default: () => [],
      required: true,
    },
    paymentTotalAmount: {
      type: String,
      default: '0.00',
      required: true,
    },
  },
  data() {
    return {}
  },
}
</script>
