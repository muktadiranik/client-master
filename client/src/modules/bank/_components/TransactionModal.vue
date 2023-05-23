<template>
  <ca-modal :visible="transactionModalVisible" class="c-modal">
    <template slot="modal-content">
      <div class="c-modal__inner u-br-3" v-if="transaction">
        <div class="c-modal__header">
          <h6 class="o-h6 u-color-white u-font-16">Transaction Details</h6>
          <button class="u-fs-20 u-cursor-pointer" type="button" @click="closeModal">
            <i class="fal fa-times"></i>
          </button>
        </div>
        <div class="c-modal__body">
          <section class="section-transaction-details bank-global">
            <div class="u-text-right u-mb-10">
              <button class="button" type="button" @click="onViewTransactionClick">
                <i class="fal fa-edit left"></i>View Transaction
              </button>
            </div>
            <ul class="transaction-details-list">
              <li class="transaction-detail">
                <div class="key">Title</div>
                <div class="value">{{ transaction.title }}</div>
              </li>
              <li class="transaction-detail">
                <div class="key">Details</div>
                <div class="value">
                  <ul class="transaction-detail-meta-list">
                    <li class="transaction-detail-meta">
                      <div class="key">Created</div>
                      <div class="value">{{ transaction.date_created | date }}</div>
                    </li>
                    <li class="transaction-detail-meta">
                      <div class="key">Created by</div>
                      <div class="value" v-if="transaction.owner">{{ transaction.owner.username }}</div>
                    </li>
                    <li class="transaction-detail-meta">
                      <div class="key">Transaction ID</div>
                      <div class="value">{{ transaction.transaction_id }}</div>
                    </li>
                    <li class="transaction-detail-meta">
                      <div class="key">Type</div>
                      <div class="value">{{ transaction.transaction_type }}</div>
                    </li>
                    <li class="transaction-detail-meta">
                      <div class="key">Program</div>
                      <div class="value" v-if="transaction.program">
                        <router-link
                          v-if="userIsProgramManager() || userIsBanker()"
                          :to="{ name: 'ProgramTransactions', params: { uuid: transaction.program.uuid } }"
                          >{{ transaction.program.title }}</router-link
                        >
                        <router-link
                          :to="{ name: 'Program', params: { uuid: transaction.program.uuid } }"
                          v-if="!userIsProgramManager() && !userIsBanker()"
                          >{{ transaction.program.title }}</router-link
                        >
                      </div>
                    </li>
                    <li class="transaction-detail-meta" v-if="transaction.submission">
                      <div class="key">Submission</div>
                      <div class="value">
                        <router-link :to="{ name: 'Submission', params: { uuid: transaction.submission.uuid } }">{{
                          transaction.submission.title
                        }}</router-link>
                      </div>
                    </li>
                  </ul>
                </div>
              </li>
              <li class="transaction-detail" v-if="userIsProgramManager() || userIsBanker()">
                <div class="key">Notes</div>
                <div class="value">{{ transaction.notes }}</div>
              </li>
              <li class="transaction-detail" v-if="transaction.payment">
                <div class="key">Payment</div>
                <div class="value">
                  Paid via payment
                  <a @click.stop="onPaymentIdClick">
                    <strong>{{ transaction.payment.payment_id }}</strong>
                  </a>
                  on {{ transaction.payment.payment_date | date }}.
                </div>
              </li>
            </ul>
          </section>
        </div>
      </div>
    </template>
  </ca-modal>
</template>

<script>
import CaModal from '@/modules/core/_components/ca-modal/CaModal'
import DateTimeFilters from '@/filters/date-time-filters'
import { AccountMixin } from '@/mixins/account'
import { TransactionModalMixin } from '@/modules/bank/_mixins/transaction-modal'

export default {
  name: 'TransactionModal',
  components: {
    CaModal,
  },
  filters: { ...DateTimeFilters },
  mixins: [AccountMixin, TransactionModalMixin],
  data() {
    return {}
  },
  methods: {
    async closeModal() {
      await this.actionCloseTransactionModal()
    },
    onPaymentIdClick() {
      this.$router.push({
        name: 'PaymentDetailsPage',
        params: { uuid: this.transaction.payment.uuid },
      })
    },
    onViewTransactionClick() {
      this.$router.push({
        name: 'TransactionDetails',
        params: { uuid: this.transaction.uuid },
      })
    },
  },
}
</script>
