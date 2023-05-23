<template>
  <main class="c-site-main" v-if="transaction">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap l-wrap--750">
        <div class="c-box u-font-14 u-overflow-hidden">
          <div class="c-box__header">
            <h6 class="o-h6">Transaction Details</h6>
          </div>
          <!-- /.c-box__header -->
          <div class="c-box__header" v-if="transaction.deleted">
            <div class="c-alert c-alert--warning u-d-f u-ai-center">
              <i class="far fa-exclamation-circle u-mr-10"></i>
              <span>This transaction is deleted.</span>
            </div>
          </div>
          <!-- /.c-box__header -->
          <div class="c-box__header" v-if="isScheduledTransaction && !transaction.deleted">
            <div class="c-alert c-alert--warning u-d-f u-ai-center">
              <i class="far fa-exclamation-circle u-mr-10"></i>
              <span>This transaction will become active on {{ transaction.payment_date }}.</span>
            </div>
          </div>
          <!-- /.c-box__header -->
          <div class="c-box__body">
            <div class="l-transaction-details-header u-pb-20">
              <h6 class="o-h6 o-h6--sm" v-if="transaction.title">
                <router-link
                  v-if="transaction.submission_uuid"
                  :to="{ name: 'Submission', params: { uuid: transaction.submission_uuid } }"
                  >{{ transaction.title }}</router-link
                >
                <span v-else>{{ transaction.title }}</span>
              </h6>
              <div>
                <button
                  type="button"
                  class="o-btn o-btn--primary o-btn--sm o-btn--rounded-sm u-d-f u-ai-center u-ml-auto"
                  :disabled="transaction.deleted"
                  v-if="userIsProgramManager() || userIsBanker()"
                  @click="editTransaction"
                >
                  <i class="far fa-edit u-mr-5"></i>
                  <span>Edit Transaction</span>
                </button>
              </div>
            </div>
            <hr class="o-hr" />
            <div class="c-transaction-details-content">
              <div class="c-transaction-details-content__left" v-if="transaction && transaction.payee">
                <div class="c-media c-media--stack c-media--stack-center">
                  <div v-if="transaction.payee.profile_picture">
                    <img
                      :src="transaction.payee.profile_picture"
                      :alt="transaction.payee.first_name"
                      class="c-media__img c-media__img--circle"
                    />
                  </div>
                  <div class="c-media__icon c-media__icon--circle" v-else>
                    <i class="far fa-user"></i>
                  </div>
                  <div class="c-media__body">
                    <div>
                      <strong>{{ `${transaction.payee.first_name} ${transaction.payee.last_name}` }}</strong>
                    </div>
                    <div class="u-text-mute">
                      {{ transaction.payee.user_name }}
                    </div>
                    <div class="u-text-mute u-mt-10">
                      {{ transaction.payee.paypal_email }}
                    </div>
                  </div>
                </div>
                <div class="u-text-center u-mt-20">
                  <h2 class="o-h2 u-mb-10">${{ Math.floor(transaction.amount) }}</h2>
                  <div class="c-badge c-badge--primary-light c-badge--btn-xs" v-if="transaction.paid">Paid</div>
                  <div class="c-badge c-badge--btn-xs" v-else>Scheduled</div>
                </div>
              </div>
              <div class="c-transaction-details-content__right">
                <ul>
                  <li class="l-grid l-grid--row-gap-5">
                    <div><strong>Created</strong></div>
                    <div class="u-text-mute">{{ transaction.date_created | date }}</div>
                  </li>
                  <li class="l-grid l-grid--row-gap-5">
                    <div><strong>Transaction ID</strong></div>
                    <div class="u-text-mute">
                      {{ transaction.transaction_id }}
                    </div>
                  </li>
                  <li class="l-grid l-grid--row-gap-5">
                    <div><strong>Transaction Type</strong></div>
                    <div class="u-text-mute">
                      {{ transaction.transaction_type }}
                    </div>
                  </li>
                  <li class="l-grid l-grid--row-gap-5">
                    <div><strong>Program</strong></div>
                    <div class="u-text-mute" v-if="transaction && transaction.program">
                      <router-link
                        v-show="!userIsBanker() && !userIsProgramManager()"
                        :to="{
                          name: 'Program',
                          params: { uuid: transaction.program.uuid },
                        }"
                        >{{ transaction.program.title }}</router-link
                      >
                      <router-link
                        v-show="userIsBanker() || userIsProgramManager()"
                        :to="{
                          name: 'ProgramTransactions',
                          params: { uuid: transaction.program.uuid },
                        }"
                        >{{ transaction.program.title }}</router-link
                      >
                    </div>
                  </li>
                  <li v-if="transaction.submission">
                    <div><strong>Submission</strong></div>
                    <div>
                      <router-link
                        :to="{
                          name: 'Submission',
                          params: { uuid: transaction.submission.uuid },
                        }"
                        >{{ transaction.submission.title }}
                      </router-link>
                    </div>
                  </li>
                  <li class="l-grid l-grid--row-gap-5" v-if="transaction.payment">
                    <p class="o-text o-text--sm u-text-mute">
                      Paid via payment
                      <router-link
                        :to="{
                          name: 'PaymentDetailsPage',
                          uuid: transaction.payment.uuid,
                        }"
                        >{{ transaction.payment.payment_id }}</router-link
                      >
                      on <strong>{{ transaction.payment.payment_date }}</strong
                      >.
                    </p>
                  </li>
                </ul>
              </div>
            </div>
            <hr class="o-hr" />
            <div class="u-pt-20">
              <div class="u-d-f u-jc-fe">
                <button
                  type="button"
                  class="o-btn o-btn--red o-btn--sm o-btn--rounded-sm u-d-f u-ai-center u-mr-10"
                  @click="deleteTransaction"
                  v-if="transaction.deleted && (userIsProgramManager() || userIsBanker())"
                >
                  <i class="fal fa-trash-restore u-mr-5"></i>
                  <span>Restore Transaction</span>
                </button>
                <button
                  type="button"
                  class="o-btn o-btn--red o-btn--sm o-btn--rounded-sm u-d-f u-ai-center"
                  @click="onDeleteTransactionClick"
                  v-if="!transaction.deleted && (userIsProgramManager() || userIsBanker())"
                >
                  <i class="fal fa-trash-alt u-mr-5"></i>
                  <span>Delete Transaction</span>
                </button>
              </div>
            </div>
          </div>
          <!-- /.c-box__body -->
        </div>
        <!-- /.c-box -->
      </div>
    </div>
  </main>
</template>

<script>
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import { AccountMixin } from '@/mixins/account'
import { BankMixin } from '@/modules/bank/_mixins/bank'

import DateTimeFilters from '@/filters/date-time-filters'

export default {
  name: 'TransactionDetailsPage',
  mixins: [AccountMixin, BankMixin, BreadcrumbsMixin],
  filters: { ...DateTimeFilters },
  data() {
    return {
      transaction: {},
      today: new Date(),
    }
  },
  computed: {
    isScheduledTransaction() {
      return new Date(this.transaction.payment_date) > this.today
    },
  },
  methods: {
    onDeleteTransactionClick() {
      this.$caDialog.confirm({
        id: 'delete-transaction-dialog',
        title: 'Delete Transaction?',
        text: 'Are you sure you want to delete this transaction?',
        confirmButtonText: 'Delete Transaction',
        confirmCallback: async () => {
          await this.deleteTransaction()
          this.$caDialog.close('delete-transaction-dialog')
        },
        cancelCallback: () => {
          this.$caDialog.close('delete-transaction-dialog')
        },
        dialogClass: this.getUserTypeClass(),
      })
    },
    async deleteTransaction() {
      try {
        this.transaction = await this.actionDeleteTransaction(this.transaction.uuid)
        const message = this.transaction.deleted ? 'Transaction deleted' : 'Transaction restored'
        this.$caAlert.success(message)
      } catch (e) {
        this.$caAlert.error('Failed to update transaction')
      }
    },
    editTransaction() {
      this.$router.push({
        name: 'TransactionEdit',
        params: {
          uuid: this.transaction.uuid,
        },
      })
    },
  },
  async mounted() {
    this.$solar.show()
    const transactionUuid = this.$route.params.uuid || ''
    const response = await this.actionGetTransaction(transactionUuid)
    this.transaction = response
    this.$solar.hide()

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Transactions' }).route,
        title: 'Bank',
      },
      child: {
        title: 'Transactions',
        route: this.$router.resolve({ name: 'Transactions' }).route,
      },
      grandChild: {
        title: this.transaction.transaction_id,
        copyValue: this.transaction.uuid,
      },
    })
  },
}
</script>
