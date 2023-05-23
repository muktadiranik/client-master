<template>
  <tr class="c-datatable__row">
    <td class="c-datatable__cell">
      <span>
        {{ transaction.date_created | date }}
      </span>
    </td>
    <td class="c-datatable__cell">
      <div class="c-datatable__meta-value">${{ Math.floor(transaction.amount) }}</div>
    </td>
    <td class="c-datatable__cell o-text--500">
      <div class="c-datatable__cell--thumb">
        <img :src="transaction.program.image ? transaction.program.image : '/static/images/avatar-endpoint.svg'" />
      </div>
      <span>
        <router-link
          class="o-text--gray"
          :to="{
            name: 'Program',
            params: { uuid: transaction.program.uuid },
          }"
          >{{ transaction.program.title }}</router-link
        >
      </span>
    </td>
    <td class="c-datatable__cell">
      <span>
        <a class="o-text--dark o-text--500" @click.stop="onTransactionClicked(transaction)">{{ transaction.title }}</a>
      </span>
    </td>
  </tr>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import DateTimeFilters from '@/filters/date-time-filters'

export default {
  name: 'PaymentTransactionListItem',
  filters: { ...DateTimeFilters },
  mixins: [AccountMixin],
  data() {
    return {}
  },
  props: {
    transaction: {
      type: Object,
      default: () => {},
      required: true,
    },
  },
  methods: {
    onTransactionClicked(transaction) {
      this.$emit('on-transaction-clicked', transaction)
    },
  },
  computed: {
    showProgramMetaData() {
      if (!this.$route || !this.$route.name) {
        return false
      }
      return this.$route.name !== 'ProgramTransactions'
    },
  },
}
</script>
