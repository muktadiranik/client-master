<template>
  <div class="c-card" v-if="transaction.transactions.length > 0">
    <div class="c-card-info l-flex u-ai-fs u-fd-column">
      <div class="l-flex u-space-between" style="width:100%;">
        <div class="l-flex u-ai-center">
          <div class="c-card-info__researcher">
            <router-link
              :to="{
                name: 'UserTransactions',
                params: { uuid: transaction.researcher.uuid },
              }"
            >
              {{ `${transaction.researcher.first_name} ${transaction.researcher.last_name}` }}
            </router-link>
          </div>

          <!-- PayPal -->
          <div
            v-if="transaction.default_payment_method === 2"
            class="c-card-info__email"
            :class="{ 'c-card-info__copy': transaction.default_payment_method === 2 }"
            @click.prevent="transaction.default_payment_method === 2 ? copyToClipboard(transaction, 'email') : false"
          >
            <div v-if="transaction.researcher.paypal_email">
              {{ transaction.researcher.paypal_email }}
            </div>
            <div v-else style="color:red">
              No PayPal email available
            </div>
            <span v-if="transaction.researcher.paypal_email">
              <i class="fas fa-copy" title="Copy to clipboard"></i>
              <input
                type="hidden"
                :id="`email-${transaction.researcher.uuid}`"
                :value="transaction.researcher.paypal_email"
              />
            </span>
          </div>

          <!-- Payoneer -->
          <div
            v-if="transaction.default_payment_method === 6"
            class="c-card-info__email"
            :class="{ 'c-card-info__copy': transaction.default_payment_method === 6 }"
            @click.prevent="transaction.default_payment_method === 6 ? copyToClipboard(transaction, 'email') : false"
          >
            <div v-if="transaction.researcher.payoneer_email">
              {{ transaction.researcher.payoneer_email }}
            </div>
            <div v-else style="color:red">
              No Payoneer email available
            </div>
            <span v-if="transaction.researcher.payoneer_email">
              <i class="fas fa-copy" title="Copy to clipboard"></i>
              <input
                type="hidden"
                :id="`email-${transaction.researcher.uuid}`"
                :value="transaction.researcher.payoneer_email"
              />
            </span>
          </div>

          <!-- BTC/ETH -->
          <div
            v-if="transaction.default_payment_method === 3 || transaction.default_payment_method === 4"
            class="c-card-info__email c-card-info__copy"
            @click.prevent="copyToClipboard(transaction, 'wallet')"
          >
            {{ transaction.default_payment_method === 3 ? 'Bitcoin' : transaction.default_payment_method === 4 ? 'Ethereum' : '' }}
            Wallet Address
            <span>
              <i class="fas fa-copy" title="Copy to clipboard"></i>
              <input
                type="hidden"
                :id="`wallet-${transaction.researcher.uuid}`"
                :value="
                  transaction.default_payment_method === 3
                    ? transaction.btc_wallet_address
                    : transaction.eth_wallet_address
                "
              />
            </span>
          </div>

          <!-- Bank -->
          <!-- Account Number -->
          <div
            v-if="transaction.default_payment_method === 5"
            class="c-card-info__email c-card-info__copy"
            @click.prevent="copyToClipboard(transaction, 'account')"
          >
            Account Number
            <span>
              <i class="fas fa-copy" title="Copy to clipboard"></i>
              <input
                type="hidden"
                :id="`account-${transaction.researcher.uuid}`"
                :value="transaction.usd_bank_account_number"
              />
            </span>
          </div>
          <!-- Routing Number -->
          <div
            v-if="transaction.default_payment_method === 5"
            class="c-card-info__email c-card-info__copy"
            @click.prevent="copyToClipboard(transaction, 'routing')"
          >
            Routing Number
            <span>
              <i class="fas fa-copy" title="Copy to clipboard"></i>
              <input
                type="hidden"
                :id="`routing-${transaction.researcher.uuid}`"
                :value="transaction.usd_bank_routing_number"
              />
            </span>
          </div>
          <div v-if="transaction.default_payment_method === 5" class="c-card-info__email">
            Account Type: {{ transaction.usd_bank_type === 1 ? 'Checking' : 'Savings' }}
          </div>
        </div>

        <!-- Card icon right -->
        <div class="c-card-info__icon">
          <img v-if="transaction.default_payment_method <= 2" src="static/images/icons/dolar.svg" alt="Dollar icon" />
          <img
            v-else-if="transaction.default_payment_method === 3"
            src="static/images/icons/bitcoin.svg"
            alt="Bitcoin icon"
          />
          <img
            v-else-if="transaction.default_payment_method === 4"
            src="static/images/icons/ethereum.svg"
            alt="Ethereum icon"
          />
          <img
            v-else-if="transaction.default_payment_method === 5"
            style="width: 20px"
            src="static/images/bank.png"
            alt="Bank icon"
          />
        </div>
      </div>

      <div class="l-flex u-ai-center">
        <div class="c-card-info__amount l-flex">
          Total pending:&nbsp;
          <span class="c-card-info__copy" @click.prevent="copyToClipboard(transaction, 'total')">
            ${{ totalPending }}
            <i class="fas fa-copy" title="Copy to clipboard"></i>
            <input type="hidden" :id="`total-${transaction.researcher.uuid}`" :value="totalPending" />
          </span>
        </div>
      </div>
      <div class="c-card-info__id l-flex u-ai-center">
        <input type="text" placeholder="Reference ID" class="o-input--white" v-model="referenceId" />
        <button
          class="o-btn o-btn--primary o-btn--xs o-btn--rounded-xsm"
          type="button"
          @click.prevent="processPayment()"
        >
          Save & Mark as Paid
        </button>
      </div>
    </div>

    <div class="c-datatable c-datatable--subtable">
      <div class="c-datatable__responsive">
        <table class="c-datatable__table c-datatable__subtable">
          <thead class="c-datatable__head">
            <tr class="c-datatable__row white">
              <th class="c-datatable__cell">
                <div class="c-datatable__col-date">Date</div>
              </th>
              <th class="c-datatable__cell">
                <div class="c-datatable__col-amount">Amount</div>
              </th>
              <th class="c-datatable__cell">
                <div class="c-datatable__col-project">Project</div>
              </th>
              <th class="c-datatable__cell">
                <div class="c-datatable__col-description">Title</div>
              </th>
              <th class="c-datatable__cell"></th>
            </tr>
          </thead>
          <tbody class="c-datatable__body">
            <PendingTransactionListChildItem
              v-for="paymentTransaction in transaction.transactions"
              :key="`payment-transaction-${paymentTransaction.uuid}`"
              :transaction="paymentTransaction"
              :options="tableOptions"
              @on-transaction-clicked="onTransactionClicked"
              @on-transaction-type-click="onTransactionTypeClick"
              @remove-transaction="removeTransaction"
              v-on="$listeners"
            />
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import DateTimeFilters from '@/filters/date-time-filters'
import { PendingTransactionsMixin } from '@/modules/bank/_mixins/pending-transactions'
import { TableOptionsMixin } from '@/modules/bank/_mixins/table-options'
import PendingTransactionListChildItem from '@/modules/bank/_components/pending-transactions-list/PendingTransactionListChildItem'
export default {
  name: 'PendingTransactionListItem',
  filters: { ...DateTimeFilters },
  mixins: [AccountMixin, TableOptionsMixin, PendingTransactionsMixin],
  components: {
    PendingTransactionListChildItem,
  },
  data() {
    return {
      defaultUserImage: DEFAULT_USER_IMAGE,
      openTransactionModal: true,
      modalTransaction: {},
      isAllResearcherTxnsSelected: false,
      referenceId: '',
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
    transactionIndex: {
      type: Number,
      default: -1,
      required: true,
    },
  },
  computed: {
    showPayNowButton() {
      const name = this.$route && this.$route.name ? this.$route.name : ''
      if (!name || name === 'ProgramTransactions') {
        return false
      }
      return this.userIsProgramManager() || this.userIsBanker()
    },
    isMissingPaymentMethod() {
      return this.transaction.is_missing_payment_info
    },
    showProgramMetaData() {
      if (!this.$route || !this.$route.name) {
        return false
      }
      return this.$route.name !== 'ProgramTransactions'
    },
    researcher() {
      if (!this.transaction || !this.transaction.researcher) {
        return null
      }
      return this.transaction.researcher
    },
    researcherNameAndUsername() {
      if (!this.researcher) {
        return ''
      }

      const username = this.researcher.username || this.researcher.user_name
      if (!username) {
        return ''
      }

      const firstName = this.researcher.first_name || ''
      const lastName = this.researcher.last_name || ''
      const fullName = `${firstName} ${lastName}`.trim()
      return `${fullName} (${username})`
    },
    totalPending() {
      return this.transaction.transactions.reduce((acc, cur) => acc + parseInt(cur.amount), 0).toFixed(2)
    },
  },
  methods: {
    onTransactionClicked(transaction) {
      this.$emit('on-transaction-clicked', transaction)
    },
    onPayNowClick() {
      this.$router.push({
        name: 'PaymentCreate',
        params: { userUuid: this.transaction.researcher.uuid },
      })
    },
    copyToClipboard(transaction, dataType) {
      const { uuid } = transaction.researcher
      let target

      switch (dataType) {
        case 'wallet':
          target = document.querySelector(`#wallet-${uuid}`)
          break
        case 'email':
          target = document.querySelector(`#email-${uuid}`)
          break
        case 'total':
          target = document.querySelector(`#total-${uuid}`)
          break
        case 'routing':
          target = document.querySelector(`#routing-${uuid}`)
          break
        case 'account':
          target = document.querySelector(`#account-${uuid}`)
          break
        default:
          target = document.querySelector(`#email-${uuid}`)
      }

      target.setAttribute('type', 'text')
      target.select()
      try {
        document.execCommand('copy')
        if (dataType === 'wallet') {
          if (transaction.default_payment_method === 3) {
            this.$caAlert.success('Bitcoin address copied to clipboard')
          } else if (transaction.default_payment_method === 4) {
            this.$caAlert.success('Ethereum address copied to clipboard')
          }
        }
        if (dataType === 'email') {
          this.$caAlert.success('Email copied to clipboard')
        }
        if (dataType === 'total') {
          this.$caAlert.success('Total pending amount copied to clipboard')
        }
        if (dataType === 'routing') {
          this.$caAlert.success('Routing number copied to clipboard')
        }
        if (dataType === 'account') {
          this.$caAlert.success('Account number copied to clipboard')
        }
      } catch (err) {
        this.$caAlert.success('Failed to copy to clipboard')
      }
      target.setAttribute('type', 'hidden')
      window.getSelection().removeAllRanges()
    },
    onTransactionTypeClick(transaction) {
      this.openTransactionModal = true
      this.modalTransaction = transaction
    },
    selectAllSingleResearcher() {
      this.$emit('select-all-single-researcher', this.transaction.researcher.uuid, this.isAllResearcherTxnsSelected)
      this.isAllResearcherTxnsSelected = !this.isAllResearcherTxnsSelected
    },
    removeTransaction(uuid) {
      this.transaction.transactions = this.transaction.transactions.filter(txn => txn.uuid !== uuid)
    },
    async processPayment() {
      try {
        const ids = this.transaction.transactions.map(tx => tx.uuid)
        await this.actionUpdateTransactions({
          reference_id: this.referenceId,
          transaction_uuids: ids,
          payment_method: this.transaction.default_payment_method,
          recipient: this.transaction.researcher.uuid,
        })
        this.referenceId = ''
        this.$caAlert.success('Transactions processed')
      } catch (error) {
        this.$caAlert.error('Error processing transactions')
      } finally {
        this.actionLoadPendingTransactions()
      }
    },
  },
}
</script>

<style lang="scss"></style>
