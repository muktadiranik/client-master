<template>
  <div class="c-box">
    <div class="c-box__header u-pb-0">
      <div class="u-space-between u-ai-center u-nm-10">
        <div class="u-m-10">
          <nav class="c-menu c-menu--secondary">
            <ul class="c-menu__list c-menu__list--inline">
              <!-- Paypal -->
              <li
                class="c-menu__item"
                @click="tab = 'paypal'"
                :class="{ 'c-menu__item--active': tab === 'paypal' }"
              >
                <div class="c-menu__link">
                  <span class="c-menu__link-text">PayPal ({{ paypalTxns.length }})</span>
                </div>
              </li>
              <!-- Payoneer-->
              <li
                class="c-menu__item"
                @click="tab = 'payoneer'"
                :class="{ 'c-menu__item--active': tab === 'payoneer' }"
              >
                <div class="c-menu__link">
                  <span class="c-menu__link-text">Payoneer ({{ payoneerTxns.length }})</span>
                </div>
              </li>
              <!--  Crypto -->
              <li
                class="c-menu__item"
                @click="tab = 'crypto'"
                :class="{ 'c-menu__item--active': tab === 'crypto' }"
              >
                <div class="c-menu__link">
                  <span class="c-menu__link-text">Crypto ({{ cryptoTxns.length }})</span>
                </div>
              </li>
              <!--  Bank -->
              <li
                class="c-menu__item"
                @click="tab = 'bank'"
                :class="{ 'c-menu__item--active': tab === 'bank' }"
              >
                <div class="c-menu__link">
                  <span class="c-menu__link-text">Bank ({{ bankTxns.length }})</span>
                </div>
              </li>
              <!--  No Payment Specified -->
              <li
                class="c-menu__item"
                @click="tab = 'not-specified'"
                :class="{ 'c-menu__item--active': tab === 'not-specified' }"
              >
                <div class="c-menu__link">
                  <span class="c-menu__link-text">No Payment Specified ({{ notSpecifiedTxns.length }})</span>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </div>
    <!-- /.c-box__header -->
    <div class="c-box__body u-p-0">
      <div class="c-datatable c-datatable--pending-transactions">
        <div class="c-datatable__responsive">
          <div class="u-mt-20" v-show="loading">
            <Spinner size="medium" />
          </div>
          <PendingTransactionListBody
            :transactions="getTransactionsByTab"
            :loading="loading"
            @on-transaction-clicked="onTransactionClicked"
          ></PendingTransactionListBody>
        </div>
        <div class="l-flex u-ai-center u-jc-between" v-if="getTransactionsByTab.length > 0">
          <CPagination :current-page="currentPage" :page-count="pageCount" @on-page-change="onPageChange" />
        </div>
      </div>
    </div>
    <!-- /.c-box__body -->
  </div>
  <!-- /.c-box -->
</template>

<script>
import CPagination from '@/modules/core/_components/c-pagination/CPagination'
import { AccountMixin } from '@/mixins/account'
import { clickOutside } from '@/directives/click-outside'
import { TableOptionsMixin } from '@/modules/bank/_mixins/table-options'
import DateTimeFilters from '@/filters/date-time-filters'
import PendingTransactionListBody from '@/modules/bank/_components/pending-transactions-list/PendingTransactionListBody'
import { TRANSACTION_SORT_OPTIONS } from '@/modules/bank/_components/transaction-list/transaction-sort-options'
import Spinner from 'vue-simple-spinner'

export default {
  name: 'PendingTransactionList',
  mixins: [AccountMixin, TableOptionsMixin],
  directives: {
    clickOutside,
  },
  components: {
    CPagination,
    PendingTransactionListBody,
    Spinner,
  },
  filters: { ...DateTimeFilters },
  props: {
    currentPage: {
      type: Number,
      default: 1,
      required: true,
    },
    pageCount: {
      type: Number,
      default: 1,
      required: true,
    },
    transactionCount: {
      type: Number,
      default: 0,
      required: true,
    },
    transactions: {
      type: Array,
      default: () => [],
      required: true,
    },
    sortOrder: {
      type: String,
      required: true,
    },
    sortOption: {
      type: Object,
      default: () => {},
      required: true,
    },
    loading: {
      type: Boolean,
      default: () => false,
      required: true,
    },
  },
  data() {
    return {
      defaultUserImage: DEFAULT_USER_IMAGE,
      sortOptions: Object.values(TRANSACTION_SORT_OPTIONS),
      tab: 'paypal'
    }
  },
  computed: {
    paypalTxns() {
      return this.transactions.filter(tx => tx.default_payment_method === 2)
    },
    payoneerTxns(){
      return this.transactions.filter(tx => tx.default_payment_method === 6)
    },
    notSpecifiedTxns() {
      return this.transactions.filter(tx => tx.default_payment_method === 1)
    },
    bankTxns() {
      return this.transactions.filter(tx => tx.default_payment_method === 5)
    },
    cryptoTxns(){
      return this.transactions.filter(tx => [3, 4].includes(tx.default_payment_method))
    },
    getTransactionsByTab(){
      switch (this.tab) {
        case 'paypal':
          return this.paypalTxns
        case 'payoneer':
          return this.payoneerTxns
        case 'crypto':
          return this.cryptoTxns
        case 'bank':
          return this.bankTxns
        case 'not-specified':
          return this.notSpecifiedTxns
        default:
          return []
      }
    }
  },
  methods: {
    onNewTransactionBtnClick() {
      this.$router.push({
        name: 'TransactionCreate',
      })
    },
    setSortOption(option) {
      this.$emit('on-query-changed', { sortField: option })
    },
    onNewTransactionClick() {
      this.$emit('on-new-transaction-click')
    },
    onPageChange(page) {
      if (page > this.pageCount || page < 1) {
        return
      }
      this.$emit('page-changed', page)
    },
    onToggleTransactionOptions(transactionUuid) {
      this.selectedTransactionUuid = transactionUuid
    },
    isTransaction(transaction) {
      return transaction.transaction_type && transaction.transaction_type.length
    },
    isBountyTransaction(transaction) {
      return transaction.transaction_type && transaction.transaction_type === 'Bounty'
    },
    onHeaderClick(name) {
      const sortOption = this.sortOptions.find(x => x.name === name)
      this.$emit('sort-changed', sortOption)
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
