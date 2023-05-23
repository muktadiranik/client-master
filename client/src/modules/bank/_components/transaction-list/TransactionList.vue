<template>
  <div>
    <div
      class="c-datatable"
      :class="{ 'c-datatable--historical-transactions': $route.name === 'TransactionsHistorical' }"
    >
      <div class="c-datatable__responsive">
        <table class="c-datatable__table">
          <thead class="c-datatable__head">
            <tr class="c-datatable__row">
              <th class="c-datatable__cell" v-if="isPaid">
                <div class="c-datatable__col-toggle"></div>
              </th>
              <th class="c-datatable__cell" @click="onHeaderClick('Payment Date')">
                <span
                  class="c-datatable__sort-icon"
                  :class="sortOption.name === 'Payment Date' ? 'sort-icon-selected' : ''"
                  @click="$emit('onSortChange', 'DateCreated')"
                  >Created</span
                >
              </th>
              <th class="c-datatable__cell" @click="onHeaderClick('Amount')">
                <span
                  class="c-datatable__sort-icon"
                  :class="sortOption.name === 'Amount' ? 'sort-icon-selected' : ''"
                  @click="$emit('onSortChange', 'Amount')"
                  >Amount</span
                >
              </th>
              <th class="c-datatable__cell" v-show="!isPaid">
                <span>Program</span>
              </th>
              <th class="c-datatable__cell" v-show="!isPaid">
                <div class="c-datatable__col-transaction">
                  <span>Title</span>
                </div>
              </th>
              <th class="c-datatable__cell" v-show="isPaid">
                <span>Transaction</span>
              </th>
              <th class="c-datatable__cell">
                <span>Payment Method</span>
              </th>
            </tr>
          </thead>
          <TransactionListBody
            :isPaid="isPaid"
            :transactions="transactions"
            :options="tableOptions"
          ></TransactionListBody>
        </table>
      </div>
    </div>
    <CPagination :current-page="currentPage" :page-count="pageCount" @on-page-change="onPageChange" />
  </div>
</template>

<script>
import CPagination from '@/modules/core/_components/c-pagination/CPagination'
import { AccountMixin } from '@/mixins/account'
import { clickOutside } from '@/directives/click-outside'
import DateTimeFilters from '@/filters/date-time-filters'
import TransactionListBody from '@/modules/bank/_components/transaction-list/TransactionListBody'
import { TRANSACTION_SORT_OPTIONS } from '@/modules/bank/_components/transaction-list/transaction-sort-options'
import { TRANSACTION_FILTER_OPTIONS } from '@/modules/bank/_components/transaction-list/transaction-filter-options'
import { TableOptionsMixin } from '@/modules/bank/_mixins/table-options'

export default {
  name: 'TransactionList',
  mixins: [AccountMixin, TableOptionsMixin],
  directives: {
    clickOutside,
  },
  components: {
    CPagination,
    TransactionListBody,
  },
  filters: { ...DateTimeFilters },
  props: {
    currentPage: {
      type: Number,
      default: 1,
      required: true,
    },
    filterOption: {
      type: Object,
      default: () => {},
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
    isPaid: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  data() {
    return {
      defaultUserImage: DEFAULT_USER_IMAGE,
      filterMenuVisible: false,
      filterOptions: Object.values(TRANSACTION_FILTER_OPTIONS),
      sortOptions: Object.values(TRANSACTION_SORT_OPTIONS),
    }
  },
  computed: {
    filterOptionVal: {
      get() {
        return this.filterOption
      },
      set(val) {
        this.$emit('filter-changed', val)
      },
    },
  },
  methods: {
    setFilterOption(option) {
      this.$emit('on-query-changed', { filterField: option })
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
    hideFilterMenu() {
      this.filterMenuVisible = false
    },
    toggleFilterMenu(visible) {
      this.filterMenuVisible = visible
    },
  },
}
</script>
