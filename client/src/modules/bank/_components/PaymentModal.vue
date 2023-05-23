<template>
  <ca-modal :visible="paymentModalVisible" class="c-modal">
    <template slot="modal-content">
      <div class="c-modal__inner u-br-3" v-if="payment">
        <div class="c-modal__header">
          <h6 class="o-h6 u-color-white u-font-16">Payment</h6>
          <button class="u-fs-20 u-cursor-pointer" @click="closeModal">
            <i class="fal fa-times"></i>
          </button>
        </div>
        <div class="c-modal__body">
          <section class="section-payment-details for-modal bank-global">
            <div class="u-text-right u-mb-10">
              <button class="button" @click="onViewPaymentClick"><i class="fal fa-edit left"></i>View Payment</button>
            </div>
            <div class="payment-details">
              <h5 class="section-title">Details</h5>
              <div class="payment-details__row">
                <div class="payment-details__col">
                  <ul class="payment-details__meta-list">
                    <li>
                      <div class="key">Payment ID</div>
                      <div class="val">{{ payment.payment_id }}</div>
                    </li>
                    <li>
                      <div class="key">Created by</div>
                      <div class="val" v-if="payment.owner">{{ payment.owner.user_name }}</div>
                    </li>
                    <li>
                      <div class="key">Issue Date</div>
                      <div class="val">{{ payment.payment_date }}</div>
                    </li>
                    <li v-if="userIsProgramManager() || userIsBanker()">
                      <div class="key">Paid To</div>
                      <div class="val" v-if="payment.recipient">{{ payment.recipient.user_name }}</div>
                    </li>
                    <li>
                      <div class="key">Paid Via</div>
                      <div class="val">{{ payment.payment_method_display }}</div>
                    </li>
                    <li v-if="userIsProgramManager() || userIsBanker()">
                      <div class="key">Reference ID</div>
                      <div class="val">{{ payment.reference_id || '-' }}</div>
                    </li>
                  </ul>
                </div>
                <div class="payment-details__col">
                  <CaUserProfilePill v-if="payment.recipient" :profile="payment.recipient" />
                  <div class="payment-details__notes" v-if="userIsProgramManager() || userIsBanker()">
                    <h6>Notes</h6>
                    <p>{{ payment.notes }}</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="payment-items" v-if="showItemizedTransactions">
              <h5 class="section-title">Items</h5>
              <ItemizedTransactionTable :transactions="payment.transactions" :payment-total-amount="payment.amount" />
            </div>
            <div class="payment-items program-costs" v-if="showProgramCostsTable">
              <h5 class="section-title">Program Costs</h5>
              <ProgramCostsTable
                :program-costs="payment.program_costs"
                :program-costs-total="payment.program_costs_total"
              />
            </div>
          </section>
        </div>
      </div>
    </template>
  </ca-modal>
</template>

<script>
import CaModal from '@/modules/core/_components/ca-modal/CaModal'
import CaUserProfilePill from '@/modules/core/_components/ca-user-profile-pill/CaUserProfilePill'
import { AccountMixin } from '@/mixins/account'
import { PaymentModalMixin } from '@/modules/bank/_mixins/payment-modal'
import ItemizedTransactionTable from '@/modules/bank/_components/ItemizedTransactionTable'
import ProgramCostsTable from '@/modules/bank/_components/ProgramCostsTable'

export default {
  name: 'PaymentModal',
  components: {
    CaModal,
    CaUserProfilePill,
    ItemizedTransactionTable,
    ProgramCostsTable,
  },
  mixins: [AccountMixin, PaymentModalMixin],
  data() {
    return {}
  },
  computed: {
    showItemizedTransactions() {
      if (!this.userIsBanker() && !this.userIsProgramManager()) {
        return false
      }
      return this.payment && this.payment.transactions
    },
    showProgramCostsTable() {
      if (!this.userIsBanker() && !this.userIsProgramManager()) {
        return false
      }
      return this.payment && this.payment.program_costs
    },
  },
  methods: {
    async closeModal() {
      await this.actionClosePaymentModal()
    },
    onViewPaymentClick() {
      this.$router.push({
        name: 'PaymentDetailsPage',
        params: { uuid: this.payment.uuid },
      })
    },
  },
}
</script>
