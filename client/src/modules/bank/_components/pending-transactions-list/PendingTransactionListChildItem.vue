<template>
  <tr class="c-datatable__row">
    <td class="c-datatable__cell">
      <div class="c-datatable__transaction-date">
        <span className="c-datatable__meta">
          {{ transaction.date_created | date }}
        </span>
      </div>
    </td>
    <td class="c-datatable__cell">
      <div class="c-datatable__meta-value">${{ transaction.amount }}</div>
    </td>
    <td class="c-datatable__cell">
      <div class="c-datatable__project">{{ transaction.program.title }}</div>
    </td>
    <td class="c-datatable__cell">
      <div class="c-datatable__title-pending" v-if="transaction.program">
        <a @click.stop="onTransactionClicked(transaction)">
          {{ transaction.title }}
        </a>
      </div>
    </td>
    <td class="c-datatable__cell">
      <div class="c-datatable__remove" @click="$emit('remove-transaction', transaction.uuid)">
        <div>
          <i class="fas fa-window-close"></i>
        </div>
      </div>
    </td>
  </tr>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import DateTimeFilters from '@/filters/date-time-filters'
import { TableOptionsMixin } from '@/modules/bank/_mixins/table-options'

export default {
  name: 'PendingTransactionListChildItem',
  filters: { ...DateTimeFilters },
  mixins: [AccountMixin, TableOptionsMixin],
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
}
</script>
