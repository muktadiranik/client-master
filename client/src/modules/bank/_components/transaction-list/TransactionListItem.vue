<template>
  <tr class="c-datatable__row">
    <td
      class="c-datatable__cell c-datatable__cell--toggle"
      v-if="isPaid"
      @click="$emit('toggle-payment-transactions-expanded', transaction.uuid)"
    >
      <div class="c-datatable__col-toggle" :class="{ expanded: paymentTransactionsExpanded }">
        <i class="far fa-chevron-right" v-show="transaction.transactions"></i>
      </div>
    </td>
    <td class="c-datatable__cell">
      <div class="c-datatable__col-created">
        {{ transaction.date_created | date }}
      </div>
    </td>
    <td class="c-datatable__cell">
      <div class="o-text--dark o-text--500">${{ Math.floor(transaction.amount) }}</div>
    </td>
    <td class="c-datatable__cell o-text--500" v-if="!isPaid">
      <div class="c-datatable__cell--thumb">
        <img :src="this.transaction.program ? this.transaction.program.image : '/static/images/avatar-endpoint.svg'" />
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
    <td class="c-datatable__cell c-datatable__cell--title" v-if="!isPaid">
      <a @click.stop="onTransactionClicked(transaction)" class="o-text--dark o-text--500">{{ transaction.title }}</a>
    </td>

    <td class="c-datatable__cell" v-if="isPaid">
      <span class="o-text--dark o-text--500">
        {{ transaction.title }}
      </span>
    </td>
    <td class="c-datatable__cell">
      <div class="c-datatable__col-payment-method--paypal">
        <i :class="paymentMethodIconClass"></i>
        <span>{{ displayPaymentInformation() }}</span>
      </div>
    </td>
  </tr>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import DateTimeFilters from '@/filters/date-time-filters'
import { TableOptionsMixin } from '@/modules/bank/_mixins/table-options'

export default {
  name: 'TransactionListItem',
  filters: { ...DateTimeFilters },
  mixins: [AccountMixin, TableOptionsMixin],
  data() {
    return {
      defaultUserImage: DEFAULT_USER_IMAGE,
    }
  },
  props: {
    transaction: {
      type: Object,
      default: () => {},
      required: true,
    },
    paymentTransactionsExpanded: {
      type: Boolean,
      default: false,
      required: true,
    },
    isPaid: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  computed: {
    paymentMethodIconClass() {
      if (!this.transaction.payment_method_display) {
        return ''
      }
      const paymentMethod = this.transaction.payment_method_display.toLowerCase()
      switch (paymentMethod) {
        case 'paypal':
          return 'fab fa-paypal u-color-paypal'
        case 'btc':
          return 'fab fa-btc u-color-btc'
        case 'eth':
          return 'fab fa-ethereum u-color-eth'
        case 'bank':
          return 'far fa-university u-color-bank'
        case 'payoneer':
          return 'far fa-money-bill'
        default:
          return ''
      }
    },
    showRecipientMetaData() {
      if (!this.recipient) {
        return false
      }

      if (!this.$route) {
        return false
      }

      const name = this.$route.name || ''
      return name !== 'UserTransactions'
    },
    recipientUsername() {
      if (!this.recipient) {
        return null
      }

      return this.recipient.username || this.recipient.user_name
    },
    recipientNameAndUsername() {
      if (!this.recipient) {
        return ''
      }

      const username = this.recipientUsername
      if (!username) {
        return ''
      }

      const firstName = this.recipient.first_name || ''
      const lastName = this.recipient.last_name || ''
      const fullName = `${firstName} ${lastName}`.trim()
      return `${fullName} (${username})`
    },
    recipient() {
      if (!this.transaction) {
        return null
      }
      return this.transaction.researcher || this.transaction.recipient || this.transaction.payee || null
    },
    showProgramMetaData() {
      if (!this.$route || !this.$route.name) {
        return false
      }
      const routes = ['ProgramTransactions', 'UserProfileTransactions', 'UserTransactions']
      return routes.includes(this.$route.name)
    },
  },
  methods: {
    onTransactionClicked(transaction) {
      this.$emit('on-transaction-clicked', transaction)
    },
    displayPaymentInformation() {
      return this.transaction.payment_method_display && this.transaction.payment_method_display.toLowerCase() !== 'none'
        ? `${this.transaction.payment_method_display} - ${this.transaction.payment_address}`
        : this.transaction.payment_method_display
    },
  },
}
</script>

<style lang="scss"></style>
