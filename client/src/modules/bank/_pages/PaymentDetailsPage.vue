<template>
  <main class="c-site-main">
    <div class="u-pt-20 u-pb-20">
      <div class="l-wrap">
        <div class="u-mb-20 u-hidden u-visible-at-374">
          <div class="u-d-f u-jc-fe">
            <button
              class="o-btn o-btn--primary o-btn--sm o-btn--rounded-sm u-d-if u-ai-center"
              @click="editPaymentClick"
            >
              <i class="fal fa-edit u-mr-5"></i>
              <span>Edit Payment</span>
            </button>
          </div>
        </div>
        <div class="c-box u-font-14">
          <div class="c-box__header u-d-f u-ai-center u-jc-sb">
            <h6 class="o-h6">Payment Details</h6>
            <div class="u-hidden u-visible-at-375" v-if="isPmOrBanker">
              <button
                class="o-btn o-btn--primary o-btn--sm o-btn--rounded-sm u-d-if u-ai-center"
                @click="editPaymentClick"
              >
                <i class="fal fa-edit u-mr-5"></i>
                <span>Edit Payment</span>
              </button>
            </div>
          </div>
          <div class="c-box__body u-p-0">
            <div class="l-grid l-grid--col-2-at-500 l-grid--col-1-2-at-768 u-ai-stretch">
              <div class="u-p-20 u-border-right-at-500 u-d-f u-ai-center u-jc-center">
                <div>
                  <div class="c-media c-media--stack c-media--stack-center">
                    <div v-if="paymentRecipient && paymentRecipient.profile_picture">
                      <img
                        :src="paymentRecipient.profile_picture"
                        :alt="paymentRecipient.first_name"
                        class="c-media__img c-media__img--circle"
                      />
                    </div>
                    <div v-else>
                      <img :src="defaultUserImage" class="c-media__img c-media__img--circle" />
                    </div>
                    <div class="c-media__body" v-if="paymentRecipient">
                      <div>
                        <strong>{{ `${paymentRecipient.first_name} ${paymentRecipient.last_name}` }}</strong>
                      </div>
                      <div class="u-text-mute">
                        {{ paymentRecipient.user_name }}
                      </div>
                      <div class="u-text-mute u-mt-10">
                        {{ paymentRecipient.paypal_email }}
                      </div>
                    </div>
                  </div>
                  <div class="u-text-center u-mt-20">
                    <h2 class="o-h2 u-mb-10" v-if="payment && payment.amount">${{ Math.floor(payment.amount) }}</h2>
                    <div class="c-badge c-badge--primary-light c-badge--btn-xs">Paid</div>
                  </div>
                </div>
              </div>
              <div class="u-p-20 u-border-top-below-500">
                <ul class="l-grid l-grid--row-gap-20" v-if="payment">
                  <li class="l-grid l-grid--row-gap-5">
                    <div><strong>Payment ID</strong></div>
                    <div class="u-text-mute" v-if="payment && payment.payment_id">
                      {{ payment.payment_id }}
                    </div>
                  </li>
                  <li class="l-grid l-grid--row-gap-5">
                    <div><strong>Issue Date</strong></div>
                    <div class="u-text-mute">{{ payment.payment_date | date }}</div>
                  </li>
                  <li class="l-grid l-grid--row-gap-5">
                    <div><strong>Paid Via</strong></div>
                    <div class="u-text-mute">{{ payment.payment_method_display }}</div>
                  </li>
                  <li class="l-grid l-grid--row-gap-5">
                    <div><strong>Paid Address</strong></div>
                    <div class="u-text-mute">{{ payment.paid_to_address }}</div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
        <div class="u-mt-20" v-if="showItemizedTransactions">
          <div>
            <div class="c-box u-overflow-hidden">
              <div class="c-box__header">
                <h6 class="o-h6">Payment Items</h6>
              </div>
              <div class="c-box__body u-p-0" v-if="showItemizedTransactions">
                <ItemizedTransactionTable
                  v-if="showItemizedTransactions"
                  :transactions="payment.transactions"
                  :payment-total-amount="payment.amount"
                />
              </div>
              <!-- /.c-box__body -->
            </div>
            <!-- /.c-box -->
            <div
              class="u-d-f u-ai-center u-mt-20"
              :class="{ 'u-jc-sb': payment.deleted, 'u-jc-fe': !payment.deleted }"
              v-if="payment"
            >
              <button
                class="o-btn o-btn--primary o-btn--sm o-btn--rounded-sm u-d-if u-ai-center"
                @click="onRestorePaymentClick"
                v-if="isPmOrBanker && payment.deleted"
              >
                <i class="fal fa-trash-alt u-mr-5"></i>
                <span>Restore Payment</span>
              </button>
              <button
                class="o-btn o-btn--red o-btn--sm o-btn--rounded-sm u-d-if u-ai-center"
                @click="onDeletePaymentClick"
                v-if="isPmOrBanker && !payment.deleted"
              >
                <i class="far fa-trash-alt u-mr-5"></i>
                <span>Delete Payment</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      <!-- /.l-wrap -->
    </div>
  </main>
</template>

<script>
import { BreadcrumbsMixin } from '@/mixins/breadcrumbs'
import ItemizedTransactionTable from '@/modules/bank/_components/ItemizedTransactionTable'
import { AccountMixin } from '@/mixins/account'
import { BankMixin } from '@/modules/bank/_mixins/bank'
import { PaymentMixin } from '@/modules/bank/_mixins/payment'
import DateTimeFilters from '@/filters/date-time-filters'

export default {
  name: 'PaymentDetailsPage',
  mixins: [AccountMixin, BankMixin, BreadcrumbsMixin, PaymentMixin],
  components: {
    ItemizedTransactionTable,
  },
  filters: { ...DateTimeFilters },
  data() {
    return {
      defaultUserImage: DEFAULT_USER_IMAGE,
    }
  },
  computed: {
    usdBank() {
      if (!this.payment) {
        return null
      }
      return this.payment.usd_bank || null
    },
    paymentAddress() {
      if (!this.payment || !this.payment.payment_method_display) {
        return null
      }
      return this.payment.paid_to_address || null
    },
    paymentRecipient() {
      return this.payment && this.payment.recipient ? this.payment.recipient : null
    },
    isPmOrBanker() {
      return this.userIsBanker() || this.userIsProgramManager()
    },
    showItemizedTransactions() {
      if (!this.userIsBanker() && !this.userIsProgramManager()) {
        return false
      }
      return this.payment && this.payment.transactions
    },
  },
  methods: {
    editPaymentClick() {
      this.$router.push({
        name: 'PaymentEdit',
        params: { uuid: this.payment.uuid },
      })
    },
    async onRestorePaymentClick() {
      try {
        await this.actionDeletePayment(this.payment.uuid)
        this.$caAlert.success('Payment restored')
      } catch (e) {
        this.$caAlert.error('Failed to restore payment')
      }
    },
    onDeletePaymentClick() {
      this.$caDialog.confirm({
        id: 'delete-payment-dialog',
        title: 'Delete Payment?',
        text: 'Are you sure you want to delete this payment?',
        confirmButtonText: 'Delete Payment',
        confirmCallback: async () => {
          await this.actionDeletePayment(this.payment.uuid)
          this.$caDialog.close('delete-payment-dialog')
        },
        cancelCallback: () => {
          this.$caDialog.close('delete-payment-dialog')
        },
        dialogClass: this.getUserTypeClass(),
      })
    },
  },
  async mounted() {
    this.$solar.show()
    await this.actionLoadPayment(this.$route.params.uuid)

    this.actionSetBreadcrumbs({
      parent: {
        route: this.$router.resolve({ name: 'Transactions' }).route,
        title: 'Bank',
      },
      child: {
        title: 'Payments',
        route: this.$router.resolve({ name: 'TransactionsHistorical' }).route,
      },
      grandChild: {
        title: this.payment.payment_id,
        route: this.$route,
        copyValue: this.payment.uuid,
      },
    })
    this.$solar.hide()
  },
}
</script>
