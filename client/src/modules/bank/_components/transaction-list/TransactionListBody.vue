<template>
  <tbody class="c-datatable__body">
    <template v-for="(transaction, index) in transactions">
      <TransactionListItem
        :key="`transaction-list-item-${index}`"
        :transaction="transaction"
        :payment-transactions-expanded="selectedTransactionUuid === transaction.uuid"
        :options="tableOptions"
        @on-transaction-clicked="onTransactionClicked"
        @toggle-payment-transactions-expanded="onTogglePaymentTransactionsExpanded"
        :isPaid="isPaid"
      />
      <template
        v-if="transaction.transactions && selectedTransactionUuid === transaction.uuid"
        class="payment-transactions-wrapper"
      >
        <tr v-if="isPaid" class="c-datatable__row" :key="`transaction-${index}`">
          <td class="c-datatable__cell u-bgc-secondary u-pl-40 u-pr-40 u-pt-30 u-pb-30" colspan="5">
            <div class="c-datatable c-datatable--subtable">
              <div class="c-datatable__responsive">
                <table class="c-datatable__table c-datatable__subtable">
                  <thead class="c-datatable__head">
                    <tr class="c-datatable__row">
                      <th class="c-datatable__cell">
                        <div class="c-datatable__col">Created</div>
                      </th>
                      <th class="c-datatable__cell">
                        <div class="c-datatable__col-amount">Amount</div>
                      </th>
                      <th class="c-datatable__cell">
                        <div class="c-datatable__col">Program</div>
                      </th>
                      <th class="c-datatable__cell">
                        <div class="c-datatable__col">Title</div>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="c-datatable__body">
                    <PaymentTransactionListItem
                      v-for="paymentTransaction in transaction.transactions"
                      :key="`payment-transaction-${paymentTransaction.uuid}`"
                      :transaction="paymentTransaction"
                      :options="tableOptions"
                      @on-transaction-clicked="onTransactionClicked"
                      @on-transaction-type-click="onTransactionTypeClick"
                    />
                    <TransactionDetailsModal
                      v-if="openTransactionModal"
                      :transaction="modalTransaction"
                      @on-modal-overlay-click="onModalOverlayClick"
                      @on-modal-close-icon-click="openTransactionModal = false"
                    />
                  </tbody>
                </table>
              </div>
            </div>
          </td>
        </tr>
      </template>
    </template>

    <!-- if no historical transactions -->
    <tr class="c-datatable__row" v-if="transactions.length === 0">
      <td class="c-datatable__cell" colspan="10">
        <div class="u-fw-700 u-text-center">No rows to show.</div>
      </td>
    </tr>
  </tbody>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import { clickOutside } from '@/directives/click-outside'
import TransactionListItem from '@/modules/bank/_components/transaction-list/TransactionListItem'
import PaymentTransactionListItem from '@/modules/bank/_components/transaction-list/PaymentTransactionListItem'
import { TableOptionsMixin } from '@/modules/bank/_mixins/table-options'

import TransactionDetailsModal from '@/modules/bank/_components/TransactionDetailsModal.vue'

export default {
  name: 'TransactionListBody',
  mixins: [AccountMixin, TableOptionsMixin],
  directives: {
    clickOutside,
  },
  components: {
    TransactionListItem,
    PaymentTransactionListItem,
    TransactionDetailsModal,
  },
  props: {
    transactions: {
      type: Array,
      default: () => [],
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      defaultUserImage: DEFAULT_USER_IMAGE,
      selectedTransactionUuid: '',
      openTransactionModal: false,
      modalTransaction: {},
    }
  },
  computed: {},
  methods: {
    onModalOverlayClick() {
      if (event.target.className === 'c-modal') {
        this.openTransactionModal = false
      }
    },
    onTransactionTypeClick(transaction) {
      this.openTransactionModal = true
      this.modalTransaction = transaction
    },
    onTogglePaymentTransactionsExpanded(uuid) {
      const isExpanded = this.selectedTransactionUuid === uuid
      this.selectedTransactionUuid = isExpanded ? '' : uuid
    },
    isBountyTransaction(transaction) {
      return transaction.transaction_type && transaction.transaction_type === 'Bounty'
    },
    isTransaction(transaction) {
      return transaction.transaction_type && transaction.transaction_type.length
    },
    onTransactionClicked(transaction) {
      if (this.isBountyTransaction(transaction) && transaction.submission_uuid) {
        this.$router.push({
          name: 'Submission',
          params: { uuid: transaction.submission_uuid },
        })
        return
      }

      if (this.isTransaction(transaction)) {
        this.$router.push({
          name: 'TransactionDetails',
          params: { uuid: transaction.uuid },
        })
        return
      }

      if (!(this.userIsProgramManager() || this.userIsBanker())) {
        return
      }

      this.$router.push({
        name: 'PaymentDetailsPage',
        params: { uuid: transaction.uuid },
      })
    },
  },
}
</script>
