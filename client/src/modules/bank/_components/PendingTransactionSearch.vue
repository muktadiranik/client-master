<template>
  <div class="pending-transaction-search-wrapper" v-show="visible">
    <div class="p-0 pending-transaction-search">
      <div class="pending-transaction-search__header">
        <h4><i class="far fa-user-circle"></i>Security Researchers</h4>
        <div class="pending-transaction-search-toggle" @click="$emit('close-pending-transaction-search')">
          <i class="fa fa-times"></i>
        </div>
      </div>
      <div class="box__main">
        <div class="input-wrapper before clearable">
          <input
            class="form__control"
            type="text"
            placeholder="Type to search for user..."
            :value="searchTerms"
            @input="onSearchTermsInput($event.target.value)"
          />
          <i class="fal fa-times-circle clear-input" v-show="searchTerms" @click="onSearchTermsInput('')"></i>
        </div>
        <h5>{{ searchResultsTitle }}</h5>
        <ul class="users-list" v-if="pendingTransactions">
          <li
            v-for="(transaction, index) in pendingTransactions"
            :key="`pending-transaction-${index}`"
            @click="onUserClick(transaction)"
          >
            <img
              class="user-portrait"
              :src="transaction.researcher.profile_picture || defaultUserAvatar"
              :alt="transaction.researcher.user_name"
            />
            <div>
              <div class="user-name">
                <router-link :to="{ name: 'UserTransactions', params: { uuid: transaction.researcher.uuid } }">{{
                  transaction.researcher.user_name
                }}</router-link>
              </div>
              <ul class="users-meta-list">
                <li>${{ Math.floor(transaction.amount) }} pending</li>
                <li>{{ transaction.pending_date | relativeDate(now) }}</li>
              </ul>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'
import {
  STORE_KEY,
  SEARCH_PENDING_TRANSACTIONS,
  SET_PENDING_TRANSACTIONS_QUERY,
} from '@/stores/pending-transaction-search/types'
import store from '@/stores/pending-transaction-search'
import DateTimeFilters from '@/filters/date-time-filters'

export default {
  name: 'PendingTransactionSearch',
  filters: { ...DateTimeFilters },
  data() {
    return {
      defaultUserAvatar: DEFAULT_USER_IMAGE,
      now: Date.now(),
    }
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  computed: {
    ...mapState(STORE_KEY, {
      pendingTransactions: state => state.pendingTransactions,
      pendingTransactionsQuery: state => state.pendingTransactionsQuery,
      searchTerms: state => state.pendingTransactionsQuery.searchTerms,
    }),
    searchResultsTitle() {
      return !this.searchTerms ? 'Researchers with Pending Transactions' : `Researchers matching "${this.searchTerms}"`
    },
  },
  methods: {
    ...mapActions(STORE_KEY, {
      actionSearchPendingTransactions: SEARCH_PENDING_TRANSACTIONS,
      actionSetPendingTransactionsQuery: SET_PENDING_TRANSACTIONS_QUERY,
    }),
    async onSearchTermsInput(val) {
      await this.actionSetPendingTransactionsQuery({ searchTerms: val })
    },
    onUserClick(transaction) {
      this.$router.push({
        name: 'UserTransactions',
        params: {
          uuid: transaction.researcher.uuid,
        },
      })
    },
  },
  async created() {
    if (!(STORE_KEY in this.$store._modules.root._children)) {
      this.$store.registerModule([STORE_KEY], store)
    }

    await this.actionSearchPendingTransactions()
  },
  beforeDestroy() {
    if (STORE_KEY in this.$store._modules.root._children) {
      this.$store.unregisterModule(STORE_KEY)
    }
  },
}
</script>
