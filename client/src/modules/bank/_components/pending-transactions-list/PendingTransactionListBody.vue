<template>
  <div class="c-datatable__body">
    <div v-for="(transaction, index) in transactions" :key="`pending-transaction-${index}`">
      <PendingTransactionListItem
        :transaction="transaction"
        :payment-transactions-expanded="selectedTransactionIndex === index"
        :transaction-index="index"
        :options="tableOptions"
        v-on="$listeners"
      />
    </div>

    <!-- if no pending transactions -->
    <div class="c-datatable__row" v-if="transactions.length === 0 && !loading">
      <div class="c-datatable__cell" colspan="10">
        <div class="u-fw-700 u-text-center u-mt-10">No transactions</div>
      </div>
    </div>
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { clickOutside } from '@/directives/click-outside'
import PendingTransactionListItem from '@/modules/bank/_components/pending-transactions-list/PendingTransactionListItem'
import { TableOptionsMixin } from '@/modules/bank/_mixins/table-options'

export default {
  name: 'PendingTransactionListBody',
  mixins: [AccountMixin, TableOptionsMixin],
  directives: {
    clickOutside,
  },
  components: {
    PendingTransactionListItem,
  },
  props: {
    transactions: {
      type: Array,
      default: () => [],
      required: true,
    },
    loading: {
      type: Boolean,
      default: true,
      required: true,
    },
  },
  data() {
    return {
      defaultUserImage: DEFAULT_USER_IMAGE,
      selectedTransactionIndex: -1,
    }
  },
  computed: {},
  methods: {
    onModalOverlayClick() {
      if (event.target.className === 'c-modal') {
        this.openTransactionModal = false
      }
    },
    onTogglePaymentTransactionsExpanded(index) {
      const isExpanded = this.selectedTransactionIndex === index
      this.selectedTransactionIndex = isExpanded ? -1 : index
    },
    isBountyTransaction(transaction) {
      return transaction.transaction_type && transaction.transaction_type === 'Bounty'
    },
    isTransaction(transaction) {
      return transaction.transaction_type && transaction.transaction_type.length
    },
  },
}
</script>
