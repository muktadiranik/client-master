<template>
  <div class="l-payment-create">
    <aside>
      <div class="c-box u-overflow-hidden">
        <div class="c-box__header">
          <div class="c-media c-media--lg">
            <img
              :src="userProfile.profile_picture || defaultUserAvatar"
              :alt="userProfile.username"
              class="c-media__img u-img-rounded"
            />
            <div class="c-media__body">
              <h6 class="o-h6">{{ fullName }}</h6>
              <div class="o-text o-text--sm u-fw-700 u-text-mute">
                {{ userProfile.username }}
              </div>
            </div>
          </div>
        </div>
        <!-- /.c-box__header -->
        <div class="c-box__body u-p-0">
          <ul class="c-list-group c-list-group--flush c-list-group--striped-odd">
            <li
              class="c-dictionary c-dictionary--font-sm l-dictionary l-dictionary--media-lg"
              v-if="userProfile.twitter"
            >
              <span class="c-dictionary__key u-d-if u-ai-center">
                <i class="fab fa-twitter c-dictionary__key-icon"></i>
                <span class="u-ml-10">Twitter</span>
              </span>
              <span class="c-dictionary__value u-text-mute">
                <a :href="`https://twitter.com/${userProfile.twitter}`" target="_blank" class="u-d-if">
                  <span>@</span>
                  <span>{{ userProfile.twitter }}</span>
                </a>
              </span>
            </li>
            <li
              class="c-dictionary c-dictionary--font-sm l-dictionary l-dictionary--media-lg"
              v-if="userProfile.linked_in"
            >
              <span class="c-dictionary__key u-d-if u-ai-center">
                <i class="fab fa-linkedin-in c-dictionary__key-icon"></i>
                <span class="u-ml-10">Linkedin</span>
              </span>
              <span class="c-dictionary__value u-text-mute">
                <a :href="`https://www.linkedin.com/in/${userProfile.linked_in}/`" target="_blank" class="u-d-if">
                  <span>@</span>
                  <span>{{ userProfile.linked_in }}</span>
                </a>
              </span>
            </li>
            <template>
              <li class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5" v-if="userProfile.paypal_email">
                <span class="c-dictionary__key u-d-if u-ai-center">
                  <i class="fab fa-paypal c-dictionary__key-icon"></i>
                  <span class="u-ml-10">PayPal</span>
                </span>
                <span class="c-dictionary__value u-text-mute u-pl-26">
                  <span>{{ userProfile.paypal_email }}</span>
                </span>
              </li>
              <li
                class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                v-if="userProfile.btc_wallet_address"
              >
                <span class="c-dictionary__key u-d-if u-ai-center">
                  <i class="fab fa-btc c-dictionary__key-icon"></i>
                  <span class="u-ml-10">BTC</span>
                </span>
                <span class="c-dictionary__value u-text-mute u-pl-26">
                  <span>{{ userProfile.btc_wallet_address }}</span>
                </span>
              </li>
              <li
                class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                v-if="userProfile.eth_wallet_address"
              >
                <span class="c-dictionary__key u-d-if u-ai-center">
                  <i class="fab fa-ethereum c-dictionary__key-icon"></i>
                  <span class="u-ml-10">ETH</span>
                </span>
                <span class="c-dictionary__value u-text-mute u-pl-26">
                  <span>{{ userProfile.eth_wallet_address }}</span>
                </span>
              </li>
              <li
                class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                v-if="userProfile.usd_bank_account_number"
              >
                <span class="c-dictionary__key u-d-if u-ai-center">
                  <i class="fas fa-credit-card c-dictionary__key-icon"></i>
                  <span class="u-ml-10">Bank Account Number</span>
                </span>
                <span class="c-dictionary__value u-text-mute u-pl-26">
                  <span>{{ userProfile.usd_bank_account_number }}</span>
                </span>
              </li>
              <li
                class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                v-if="userProfile.usd_bank_account_number && userProfile.usd_bank_routing_number"
              >
                <span class="c-dictionary__key u-d-if u-ai-center">
                  <i class="fas fa-credit-card c-dictionary__key-icon"></i>
                  <span class="u-ml-10">Bank Routing Number</span>
                </span>
                <span class="c-dictionary__value u-text-mute u-pl-26">
                  <span>{{ userProfile.usd_bank_routing_number }}</span>
                </span>
              </li>
              <li
                class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5"
                v-if="userProfile.usd_bank_account_number"
              >
                <span class="c-dictionary__key u-d-if u-ai-center">
                  <i class="fas fa-credit-card c-dictionary__key-icon"></i>
                  <span class="u-ml-10">Account type</span>
                </span>
                <span class="c-dictionary__value u-text-mute u-pl-26">
                  <span>{{ userProfile.usd_bank_type ? 'Checking account' : 'Savings account' }}</span>
                </span>
              </li>
              <li
                class="c-dictionary c-dictionary--font-sm l-grid l-grid--row-gap-5 u-br-0-0-3-3"
                v-if="userProfile.address.address1"
              >
                <span class="c-dictionary__key u-d-if u-ai-center">
                  <i class="fas fa-address-card c-dictionary__key-icon"></i>
                  <span class="u-ml-10">Full Address</span>
                </span>
                <span class="c-dictionary__value u-text-mute u-pl-26">
                  {{ fullAddress }}
                </span>
              </li>
            </template>
          </ul>
        </div>
        <!-- /.c-box__body -->
      </div>
      <!-- /.c-box -->
    </aside>
    <div class="u-overflow-hidden-with-box-shadow">
      <div class="c-box u-overflow-hidden">
        <div class="c-box__header">
          <h6 class="o-h6">Choose Transactions</h6>
        </div>
        <div class="c-box__body u-p-0">
          <div class="c-datatable c-datatable--choose-transactions">
            <div class="c-datatable__responsive">
              <table class="c-datatable__table" v-if="availableTransactions && !createPaymentTransactionsLoading">
                <thead class="c-datatable__head">
                  <tr class="c-datatable__row">
                    <th class="c-datatable__cell">
                      <div class="c-datatable__col-check" :class="{ active: toggleAllActive }" @click="toggleAll">
                        <i class="far fa-check-circle"></i>
                      </div>
                    </th>
                    <th class="c-datatable__cell">
                      <div class="c-datatable__col-date">
                        <span>Date</span>
                      </div>
                    </th>
                    <th class="c-datatable__cell">
                      <div class="c-datatable__col-description">
                        <span>Description</span>
                      </div>
                    </th>
                    <th class="c-datatable__cell">
                      <div class="c-datatable__col-program">
                        <span>Program</span>
                      </div>
                    </th>
                    <th class="c-datatable__cell">
                      <div class="c-datatable__col-amount u-text-right">
                        <span>Amount</span>
                      </div>
                    </th>
                  </tr>
                </thead>
                <tbody class="c-datatable__body">
                  <tr
                    class="c-datatable__row"
                    v-for="(transaction, index) in availableTransactions"
                    :key="`transaction-${index}`"
                    :class="{ inactive: !selectedTransactions.includes(transaction.uuid) }"
                  >
                    <td class="c-datatable__cell">
                      <div class="c-datatable__col-check" @click="toggleTransactionSelected(transaction)">
                        <i
                          :class="
                            !selectedTransactions.includes(transaction.uuid)
                              ? 'fal fa-circle'
                              : 'fal fa-check-circle selected'
                          "
                        ></i>
                      </div>
                    </td>
                    <td class="c-datatable__cell">
                      <div class="c-datatable__col-date">
                        {{ transaction.date_created | date }}
                      </div>
                    </td>
                    <td class="c-datatable__cell">
                      <div class="c-datatable__col-description">
                        <router-link
                          :to="{
                            name: 'TransactionDetails',
                            params: { uuid: transaction.uuid },
                          }"
                          >{{ transaction.title }}
                        </router-link>
                      </div>
                    </td>
                    <td class="c-datatable__cell">
                      <div class="c-datatable__col-program" v-if="transaction.program">
                        <router-link
                          :to="{
                            name: 'Program',
                            params: { uuid: transaction.program.uuid },
                          }"
                          >{{ transaction.program.title }}
                        </router-link>
                      </div>
                    </td>
                    <td class="c-datatable__cell">
                      <div class="c-datatable__col-amount u-text-right">${{ Math.floor(transaction.amount) }}</div>
                    </td>
                  </tr>

                  <!-- if no available transactions -->
                  <tr class="c-datatable__row" v-if="availableTransactions.length === 0">
                    <td class="c-datatable__cell" colspan="10">
                      <div class="u-fw-700 u-text-center">No rows to show.</div>
                    </td>
                  </tr>
                </tbody>
                <tfoot class="c-datatable__foot">
                  <tr class="c-datatable__row">
                    <td class="c-datatable__cell" colspan="5">
                      <div class="u-d-f u-ai-center u-jc-fe">
                        <label class="o-text o-text--sm u-color-gray-900 u-mr-10">Total Amount:</label>
                        <div class="o-text o-text--lg u-text-dark u-fw-700">{{ totalAmount }}</div>
                      </div>
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
            <!-- /.c-datatable__responsive -->
          </div>
          <!-- /.c-datatable -->
        </div>
        <!-- /.c-box__body -->
      </div>
      <!-- /.c-box -->

      <div class="c-box u-mt-20">
        <div class="c-box__body">
          <form
            class="c-form l-grid l-grid--row-gap-15 l-grid--row-gap-30-at-375"
            @submit.prevent="onSaveAndContinueClick"
          >
            <div class="l-stack l-stack--form l-stack--horizontal" v-if="availableMethods">
              <div class="c-form__group">
                <label for="paymentMethod" class="c-form__label c-form__label--small">Payment Method</label>
                <div class="c-form__select-control" v-if="availableMethods">
                  <select
                    class="o-input o-input--sm"
                    name="payment-method-select"
                    id="payment-method-select"
                    v-model="paymentMethodModel"
                  >
                    <option
                      v-for="(method, index) in availableMethods"
                      :disabled="method.name === 'None' && paymentMethod !== method.id"
                      :selected="paymentMethodModel === method.id"
                      :key="`payment-method-option-${index}`"
                      :value="method.id"
                      >{{ method.name }}</option
                    >
                  </select>
                  <i class="fal fa-chevron-down"></i>
                </div>
              </div>
              <div class="c-form__group">
                <label for="transactionID" class="c-form__label c-form__label--small">Payment ID</label>
                <input
                  type="text"
                  class="o-input o-input--sm"
                  name="transactionID"
                  id="transactionID"
                  v-model="paymentOptionsReferenceId"
                  placeholder="PMNT-1234567"
                />
              </div>
            </div>

            <div
              class="l-stack l-stack--form l-stack--horizontal"
              v-if="paymentMethodModel && paymentMethodModel == 5 && !createMode"
            >
              <div class="c-form__group" v-if="paymentMethodModel && paymentMethodModel == 5 && !createMode">
                <label for="bank-type-select" class="c-form__label c-form__label--small">Bank Account Type</label>
                <div class="c-form__select-control">
                  <select
                    class="o-input o-input--sm"
                    name="bank-type-select"
                    id="bank-type-select"
                    v-model="bankTypeModel"
                  >
                    <option value="0">Select a bank type</option>
                    <option value="1">Checking</option>
                    <option value="2">Saving</option>
                  </select>
                  <i class="fal fa-chevron-down"></i>
                </div>
              </div>
              <div class="c-form__group" v-if="paymentMethodModel && paymentMethodModel == 4 && !createMode">
                <label for="paymentNote" class="c-form__label c-form__label--small">ETH Wallet Address</label>
                <input
                  type="text"
                  class="o-input o-input--sm"
                  name="ethWalletAddress"
                  id="ethWalletAddress"
                  v-model="ethWalletAddressModel"
                  placeholder="ETH Wallet Address"
                />
              </div>
            </div>

            <div
              class="l-stack l-stack--form l-stack--horizontal"
              v-if="paymentMethodModel && paymentMethodModel == 3 && !createMode"
            >
              <div class="c-form__group" v-if="paymentMethodModel && paymentMethodModel == 3 && !createMode">
                <label for="paymentNote" class="c-form__label c-form__label--small">BTC Wallet Address</label>
                <input
                  type="text"
                  class="o-input o-input--sm"
                  name="btcWalletAddress"
                  id="btcWalletAddress"
                  v-model="btcWalletAddressModel"
                  placeholder="BTC Wallet Address"
                />
              </div>
              <div class="c-form__group" v-if="paymentMethodModel && paymentMethodModel == 5 && !createMode">
                <label for="paymentNote" class="c-form__label c-form__label--small">Bank Account Number</label>
                <input
                  type="text"
                  class="o-input o-input--sm"
                  name="bankAccountNumber"
                  id="bankAccountNumber"
                  v-model="bankAccountNumberModel"
                  placeholder="Account Number"
                />
              </div>
            </div>

            <div
              class="l-stack l-stack--form l-stack--horizontal"
              v-if="paymentMethodModel && paymentMethodModel == 5 && !createMode"
            >
              <div class="c-form__group" v-if="paymentMethodModel && paymentMethodModel == 5 && !createMode">
                <label for="paymentNote" class="c-form__label c-form__label--small">Bank Routing Number</label>
                <input
                  type="text"
                  class="o-input o-input--sm"
                  name="bankRoutingNumber"
                  id="bankRoutingNumber"
                  v-model="bankRoutingNumberModel"
                  placeholder="Routing Number"
                />
              </div>
              <div class="c-form__group" v-if="paymentMethodModel && paymentMethodModel == 2 && !createMode">
                <label for="paymentNote" class="c-form__label c-form__label--small">PayPal Email Address</label>
                <input
                  type="text"
                  class="o-input o-input--sm"
                  name="paypalEmailAddress"
                  id="paypalEmailAddress"
                  v-model="paypalEmailAddressModel"
                  placeholder="PayPal Email"
                />
              </div>
            </div>

            <div class="c-form__group">
              <label for="paymentNote" class="c-form__label c-form__label--small">Payment Note (Optional)</label>
              <textarea
                class="o-textarea"
                name="paymentNote"
                id="paymentNote"
                v-model="paymentOptionsNotes"
                placeholder="Enter a note..."
              ></textarea>
            </div>
            <div class="c-form__group u-text-center">
              <div>
                <button
                  type="button"
                  class="o-btn o-btn--primary o-btn--long o-btn--rounded"
                  @click="onSaveAndContinueClick"
                  :disabled="!paymentFormIsValid"
                >
                  <i class="fal fa-usd-circle o-icon o-icon--left"></i>Pay Now
                </button>
              </div>
            </div>
          </form>
        </div>
        <!-- /.c-box__body -->
      </div>
      <!-- /.c-box -->
    </div>
  </div>
  <!-- /.l-payment-create -->
</template>

<script>
import { AccountMixin } from '@/mixins/account'
import DateTimeFilters from '@/filters/date-time-filters'
import { CommonMixin } from '@/mixins/common/'
import { CreatePaymentMixin } from '@/modules/bank/_mixins/create-payment'

export default {
  name: 'PaymentTransactionEditor',
  filters: { ...DateTimeFilters },
  mixins: [CommonMixin, CreatePaymentMixin, AccountMixin],
  props: {
    createMode: {
      type: Boolean,
      default: false,
      required: true,
    },
  },
  data() {
    return {
      formatter: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
      }),
      defaultUserAvatar: DEFAULT_USER_IMAGE,
    }
  },
  computed: {
    availableMethods() {
      let methods =
        this.paymentInfo && this.paymentInfo.available_payment_methods ? this.paymentInfo.available_payment_methods : []

      if (!this.payment || !this.payment.available_payment_methods) {
        return methods
      }

      methods = methods.concat(this.payment.available_payment_methods || [])
      const uniques = Array.from(new Set(methods.map(a => a.id))).map(id => {
        return methods.find(a => a.id === id)
      })
      return uniques
    },
    fullName() {
      if (!this.userProfile || !this.userProfile.first_name) {
        return ''
      }
      if (!this.userProfile.last_name) {
        return `${this.userProfile.first_name}`
      }

      return `${this.userProfile.first_name} ${this.userProfile.last_name}`
    },
    fullAddress() {
      let fullAddress = ''
      const { address1, address2, city, state, zip_code: ZIP_CODE, country } = this.userProfile.address
      if (address1) {
        fullAddress = address1
      }
      fullAddress = address1 ? (fullAddress = `${address1}, `) : fullAddress
      fullAddress = address2 ? (fullAddress += `${address2}, `) : fullAddress
      fullAddress = city ? (fullAddress += `${city}, `) : fullAddress
      fullAddress = state ? (fullAddress += `${state}, `) : fullAddress
      fullAddress = ZIP_CODE ? (fullAddress += `${ZIP_CODE}, `) : fullAddress
      fullAddress = country ? (fullAddress += `${country} `) : fullAddress
      return fullAddress
    },
    paymentOptionsNotes: {
      get() {
        return this.notes
      },
      async set(val) {
        await this.actionSetPaymentOption({ notes: val })
      },
    },
    paymentMethodModel: {
      get() {
        return this.paymentMethod
      },
      async set(val) {
        await this.actionSetPaymentOption({ paymentMethod: val })
      },
    },
    paypalEmailAddressModel: {
      get() {
        return this.paypalEmailAddress
      },
      async set(val) {
        await this.actionSetPaymentOption({ paypalEmailAddress: val })
      },
    },
    paymentOptionsReferenceId: {
      get() {
        return this.referenceId
      },
      async set(val) {
        await this.actionSetPaymentOption({ referenceId: val })
      },
    },
    btcWalletAddressModel: {
      get() {
        return this.btcWalletAddress
      },
      async set(val) {
        await this.actionSetPaymentOption({ btcWalletAddress: val })
      },
    },
    ethWalletAddressModel: {
      get() {
        return this.ethWalletAddress
      },
      async set(val) {
        await this.actionSetPaymentOption({ ethWalletAddress: val })
      },
    },
    bankRoutingNumberModel: {
      get() {
        return this.bankRoutingNumber
      },
      async set(val) {
        await this.actionSetPaymentOption({ bankRoutingNumber: val })
      },
    },
    bankAccountNumberModel: {
      get() {
        return this.bankAccountNumber
      },
      async set(val) {
        await this.actionSetPaymentOption({ bankAccountNumber: val })
      },
    },
    bankTypeModel: {
      get() {
        return this.bankType
      },
      async set(val) {
        await this.actionSetPaymentOption({ bankType: val })
      },
    },
    paymentInfo() {
      if (!this.userProfile) {
        return null
      }

      return this.userProfile.payment_info || null
    },
    availableTransactions() {
      if (this.createPaymentTransactionsLoading) {
        return []
      }

      let transactions = this.transactions || []
      let paymentTransactions = this.payment && this.payment.transactions ? this.payment.transactions : []

      let availableTransactions = [...paymentTransactions]
      for (let t of transactions) {
        const existing = availableTransactions.find(x => x.uuid === t.uuid)
        if (!existing) {
          availableTransactions.push(t)
        }
      }
      return availableTransactions
    },
    saveAndContinueDisabled() {
      const selectedTransactions = this.selectedTransactions || []
      if (this.payment && this.payment.transactions) {
        const transactionUuids = this.payment.transactions.map(x => x.uuid)
        return JSON.stringify(transactionUuids) === JSON.stringify(selectedTransactions)
      }

      return !selectedTransactions || selectedTransactions.length === 0
    },
    totalAmount() {
      const selectedTransactions = this.selectedTransactions || []
      const transactions = this.availableTransactions.filter(x => selectedTransactions.includes(x.uuid))
      const totalAmount = transactions.reduce((total, obj) => {
        return parseFloat(total) + parseFloat(obj.amount || 0)
      }, 0)
      return this.formatter.format(totalAmount)
    },
    paymentFormIsValid() {
      if (!this.paymentMethodModel) {
        return false
      }

      if (this.createMode) {
        return true
      }

      switch (this.paymentMethodModel) {
        case 2:
          return this.paypalEmailAddressModel && this.paypalEmailAddressModel.length > 0
        case 3:
          return this.btcWalletAddressModel && this.btcWalletAddressModel.length > 0
        case 4:
          return this.ethWalletAddressModel && this.ethWalletAddressModel.length > 0
        case 5:
          if (!this.bankAccountNumberModel || !this.bankAccountNumberModel.length) {
            return false
          }
          if (!this.bankRoutingNumberModel || !this.bankRoutingNumberModel.length) {
            return false
          }
          if (!this.bankTypeModel || this.bankTypeModel < 1) {
            return false
          }
          return true
        default:
          return false
      }
    },
  },
  methods: {
    async toggleAll() {
      await this.actionToggleAllTransactions()
    },
    async createPayment() {
      try {
        await this.actionCreatePayment()
        this.$router.push({
          name: 'PaymentEdit',
          params: {
            uuid: this.payment.uuid,
          },
        })
        this.$caAlert.success('Payment saved')
      } catch (e) {
        const error = e.data && e.data.error ? e.data.error : 'Failed to create payment'
        this.$caAlert.error(error)
      }
    },
    async editPayment() {
      try {
        const payload = {
          transaction_uuids: this.selectedTransactions,
          uuid: this.payment.uuid,
          notes: this.paymentOptionsNotes,
          reference_id: this.paymentOptionsReferenceId,
          payment_method: this.paymentMethodModel,
          btc_wallet_address: this.btcWalletAddressModel,
          eth_wallet_address: this.ethWalletAddressModel,
          paypal_email: this.paypalEmailAddressModel,
          usd_bank_account_number: this.bankAccountNumberModel,
          usd_bank_routing_number: this.bankRoutingNumberModel,
          usd_bank_type: this.bankTypeModel,
        }
        await this.actionEditPayment(payload)
        this.$caAlert.success('Payment saved')
        this.$router.push({
          name: 'PaymentDetailsPage',
          params: { uuid: this.payment.uuid },
        })
      } catch (e) {
        const error = e.data && e.data.error ? e.data.error : 'Failed to update payment'
        this.$caAlert.error(error)
      }
    },
    async onSaveAndContinueClick() {
      if (this.payment) {
        await this.editPayment()
      } else {
        await this.createPayment()
      }
    },
    async toggleTransactionSelected(transaction) {
      await this.actionToggleTransactionSelected(transaction.uuid)
    },
  },
  async mounted() {
    if (this.paymentInfo && this.paymentInfo.default_payment_method) {
      const method = this.payment ? this.payment.payment_method : this.paymentInfo.default_payment_method
      await this.actionSetPaymentOption({
        paymentMethod: method,
      })
    }
  },
}
</script>

<style lang="scss">
.usd-bank-details {
  display: flex;
  flex-direction: column;
  font: 400 14px/17px 'Lato', Helvetica, Arial, sans-serif;
  margin: 1rem 0 0 0;
  color: #333;

  dt {
    width: 50%;
    margin-bottom: 0.25rem;
    font: 600 12px/16px 'Lato', Helvetica, Arial, sans-serif;
  }
  dd {
    width: 50%;
    &:not(:last-of-type) {
      margin-bottom: 1rem;
    }
  }
}
</style>
